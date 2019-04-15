import React from 'react';
import BN from 'bn.js';
import axios from 'axios';
import uuidv4 from 'uuid/v4';
import { Progress, Message } from 'semantic-ui-react';

import { InputFile } from '@polkadot/ui-app/index';
import { ApiProps } from '@polkadot/ui-api/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { SubmittableResult } from '@polkadot/api';
import { withMulti } from '@polkadot/ui-api';
import { stringToU8a, u8aToString, formatNumber } from '@polkadot/util';

import translate from './translate';
import { fileNameWoExt } from './utils';
import { ContentId } from './types';
import { MyAccountProps, withOnlyMembers } from '@polkadot/joy-utils/MyAccount';
import { withStorageProvider, StorageProviderProps } from './StorageProvider';
import EditMeta from './EditMeta';
import TxButton from '@polkadot/joy-utils/TxButton';

const MAX_FILE_SIZE_200_MB = 200 * 1024 * 1024;

function generateContentId () {
  const uuid = uuidv4().replace('-', '');
  return new ContentId(stringToU8a(uuid));
}

type Props = ApiProps & I18nProps & MyAccountProps & StorageProviderProps;

type State = {
  error?: any,
  file?: File,
  newContentId: ContentId,
  uploading: boolean,
  progress: number
};

const defaultState = (): State => ({
  error: undefined,
  file: undefined,
  newContentId: generateContentId(),
  uploading: false,
  progress: 0
});

class Component extends React.PureComponent<Props, State> {

  state = defaultState();

  // TODO show warning if user is not a member

  render () {
    return (
      <div className='UploadBox'>
        {this.renderContent()}
      </div>
    );
  }

  private renderContent () {
    const { error, uploading } = this.state;

    if (error) return this.renderError();
    else if (uploading) return this.renderUploading();
    else return this.renderFileInput();
  }

  private renderError () {
    const { error } = this.state;
    return (
      <Message error className='JoyMainStatus'>
        <Message.Header>Failed to upload the file</Message.Header>
        <p>{error.toString()}</p>
      </Message>
    );
  }

  private renderUploading () {
    const { file, newContentId } = this.state;
    if (!file) return <em>Loading...</em>;

    return <>
      <div className='UploadSidebar'>
        TODO show thumbnail here !!!
      </div>
      <div className='UploadMainContent'>
        {this.renderProgress()}
        <EditMeta contentId={newContentId} fileName={fileNameWoExt(file.name)} />
      </div>
    </>;
  }

  private renderProgress () {
    const { progress, error } = this.state;
    const active = !error && progress < 100;
    const success = !error && progress >= 100;
    let label = '';
    if (active) {
      label = `Your file is still uploading. Please keep this page open until it's done.`;
    } else if (success) {
      label = `Click "Publish" to make your file live.`;
    }
    return <Progress
      progress={true}
      percent={progress}
      active={active}
      success={success}
      label={label}
    />;
  }

  private renderFileInput () {
    const { file } = this.state;

    return <div className='UploadSelectForm'>
      <InputFile
        // isError={!isValidContent}
        withLabel={false}
        className={`UploadInputFile ${file ? 'FileSelected' : ''}`}
        placeholder={
          <div>
            <i className='cloud upload icon'></i>{' '}
            {file
              ? `${file.name} (${formatNumber(file.size)} bytes)`
              : 'Drag and drop either video or audio file here'
            }
          </div>
        }
        onChange={this.onFileSelected}
      />
      {file && <div className='UploadButtonBox'>
        <TxButton
          size='large'
          label={'Upload'}
          isDisabled={!file}
          tx={'dataDirectory.addContent'}
          params={this.buildTxParams()}
          txSuccessCb={this.onDataObjectCreated}
        />
      </div>}
    </div>;
  }

  private onFileSelected = (data: Uint8Array, file: File) => {
    const isValidContent = data && data.length > 0 && data.length <= MAX_FILE_SIZE_200_MB;
    if (isValidContent) {
      this.setState({ file });
    }
  }

  private buildTxParams = () => {
    const { file, newContentId } = this.state;
    if (!file) return [];

    // TODO get corresponding data type id based on file content
    const dataObjectTypeId = new BN(1);

    return [ newContentId, dataObjectTypeId, new BN(file.size) ];
  }

  private onDataObjectCreated = (_txResult: SubmittableResult) => {
    this.uploadFile();
  }

  private uploadFile = () => {
    const { file, newContentId } = this.state;
    if (!file) return;

    const uniqueName = u8aToString(newContentId);
    const config = {
      headers: {
        // TODO uncomment this once the issue fixed:
        // https://github.com/Joystream/storage-node-joystream/issues/16
        // 'Content-Type': file.type
        'Content-Type': '' // <-- this is a temporary hack
      }
    };
    const { storageProvider } = this.props;
    const url = storageProvider.buildApiUrl(uniqueName);
    this.setState({ uploading: true });

    axios
      .put<{ message: string }>(url, file, config)
      .then(_res => this.setState({ progress: 100 }))
      .catch(error => this.setState({ progress: 100, error }));
  }
}

export default withMulti(
  Component,
  translate,
  withOnlyMembers,
  withStorageProvider
);
