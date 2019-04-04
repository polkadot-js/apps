import React from 'react';
import { Progress, Message } from 'semantic-ui-react';
import axios from 'axios';

import { InputFile } from '@polkadot/ui-app/index';
import { ApiProps } from '@polkadot/ui-api/types';
import { I18nProps } from '@polkadot/ui-app/types';

import translate from './translate';
import { buildApiUrl, fileNameWoExt } from './utils';
import EditMeta from './EditMeta';

const MAX_FILE_SIZE_200_MB = 200 * 1024 * 1024;

type Props = ApiProps & I18nProps & {};

type State = {
  error?: any,
  file?: File,
  uploading: boolean,
  progress: number
};

const defaultState = (): State => ({
  error: undefined,
  file: undefined,
  uploading: false,
  progress: 0
});

class Component extends React.PureComponent<Props, State> {

  state = defaultState();

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
      <Message error className='UploadStatus'>
        <Message.Header>Failed to upload the file</Message.Header>
        <p>{error.toString()}</p>
      </Message>
    );
  }

  private renderUploading () {
    const { file } = this.state;
    let fileName = file ? fileNameWoExt(file.name) : '';
    return <>
      <div className='UploadSidebar'>
        TODO show thumbnail here
      </div>
      <div className='UploadMainContent'>
        {this.renderProgress()}
        <EditMeta fileName={fileName} />
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
    return <InputFile
      // isError={!isValidContent}
      placeholder={
        <div>
          <i className='cloud upload icon'></i>{' '}
          Drag and drop either video or audio file here
        </div>
      }
      onChange={this.onFileSelected}
    />;
  }

  private onFileSelected = (data: Uint8Array, file: File) => {
    if (data && data.length > 0 && data.length <= MAX_FILE_SIZE_200_MB) {
      this.setState({ uploading: true, file });
      const uniqueName = `${Date.now()}-${file.name}`;
      const config = {
        headers: {
          // TODO uncomment this once the issue fixed:
          // https://github.com/Joystream/storage-node-joystream/issues/16
          // 'Content-Type': file.type
          'Content-Type': '' // <-- this is a temporary hack
        }
      };
      axios
        .put<{ message: string }>(buildApiUrl(uniqueName), file, config)
        .then(_res => {
          this.setState({ progress: 100 });
        })
        .catch(error => {
          this.setState({ progress: 100, error });
        });
    }
  }
}

export default translate(Component);
