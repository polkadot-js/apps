// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps, I18nProps } from '@polkadot/ui-app/types';
import { KeyringPair$Json } from '@polkadot/util-keyring/types';

import React from 'react';

import { InputAddress } from '@polkadot/ui-app/InputAddress';
import isUndefined from '@polkadot/util/is/undefined';
import arrayContainsArray from '@polkadot/ui-app/util/arrayContainsArray';
import File from '@polkadot/ui-app/Params/Param/File';
import keyring from '@polkadot/ui-keyring/index';

import UploadModal from './UploadModal';
import translate from './translate';

let actualJsonProperties: Array<string> = [];
let blob: Blob;
const createBlob = (fileBytes: Uint8Array): Blob => new Blob([fileBytes], { type: 'text/plain;charset=utf-8' });
let expectedJsonProperties: Array<string> = [];
let fileContents: Object = {};
const fileReader: FileReader = new FileReader();
let json;
let pairRestored;

type State = {
  address: string,
  password: string,
  isPasswordModalOpen: boolean,
  error?: React.ReactNode,
  uploadedFileKeyringPair?: KeyringPair$Json
};

type Props = I18nProps & BareProps & {
  onChangeAccount: any
};

class UploadButton extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = this.emptyState();
  }

  handleUploadedFiles = (fileBytes: Uint8Array): void => {
    const { t } = this.props;

    if (!fileBytes || !fileBytes.length) {
      console.error('Error retrieving file list');
      return;
    }

    blob = createBlob(fileBytes);

    fileReader.onload = (e) => {
      try {
        if (!isUndefined(e) && e.target !== null) {
          // Cast to type 'any' since property 'result' does exist on type 'EventTarget'
          // Reference: https://stackoverflow.com/a/45017155/3208553
          fileContents = JSON.parse((e.target as any).result);
          expectedJsonProperties = ['address', 'encoding', 'meta'];
          actualJsonProperties = Object.keys(fileContents);

          if (arrayContainsArray(actualJsonProperties, expectedJsonProperties)) {
            json = fileContents;

            keyring.loadAccount(json as KeyringPair$Json);

            // Store uploaded wallet in state and open modal to get their password for it
            this.setState({ uploadedFileKeyringPair: json as KeyringPair$Json }, () => this.showPasswordModal());
          } else {
            throw Error('Unable to load account with invalid JSON property names');
          }
        }
      } catch (e) {
        console.error('Error uploading file: ', e);
        this.setState({
          error: t('upload.error.file', {
            defaultValue: 'Unable to upload account from file'
          })
        });
      }
    };

    fileReader.readAsText(blob);
  }

  processUploadedFileStorage = (): void => {
    const { password, uploadedFileKeyringPair } = this.state;
    const { onChangeAccount, t } = this.props;

    if (isUndefined(uploadedFileKeyringPair) || !uploadedFileKeyringPair.address) {
      return;
    }

    json = uploadedFileKeyringPair;

    try {
      if (!json || !Object.keys(json).length) {
        return;
      }

      pairRestored = keyring.restoreAccount(json, password);

      if (pairRestored) {
        this.hidePasswordModal();

        InputAddress.setLastValue('account', pairRestored.address());

        const json = pairRestored.toJson(password);

        // add encrypted data to keyring since immediately after account creation only secret key is in memory
        keyring.loadAccount(json);

        onChangeAccount(pairRestored.publicKey());
      } else {
        this.setState({
          error: t('upload.error.memory', {
            defaultValue: 'Unable to upload account into memory'
          })
        });
      }
    } catch (e) {
      console.error('Error processing uploaded file to local storage: ', e);
      this.setState({
        error: t('upload.error.memory', {
          defaultValue: 'Unable to upload account into memory'
        })
      });
    }
  }

  showPasswordModal = (): void => {
    this.setState({
      isPasswordModalOpen: true,
      password: ''
    });
  }

  hidePasswordModal = (): void => {
    this.setState({ isPasswordModalOpen: false });
  }

  render () {
    const { error, isPasswordModalOpen, password, uploadedFileKeyringPair } = this.state;
    const { className, style, t } = this.props;
    const address = uploadedFileKeyringPair && uploadedFileKeyringPair.address || undefined;

    return (
      <div className='accounts--Address-upload'>
        <UploadModal
          address={address}
          className={className}
          error={error}
          hidePasswordModal={this.hidePasswordModal}
          isPasswordModalOpen={isPasswordModalOpen}
          onChangePassword={this.onChangePassword}
          onDiscard={this.onDiscard}
          password={password}
          processUploadedFileStorage={this.processUploadedFileStorage}
          style={style}
          uploadedFileKeyringPair={uploadedFileKeyringPair}
        />
        <File
          className='ui--Param-File-account'
          withLabel
          label={t('upload.label.file', {
            defaultValue: 'upload account'
          })}
          onChange={this.handleUploadedFiles}
          acceptedFormats='.json'
        />
      </div>
    );
  }

  emptyState (): State {
    return {
      address: '',
      password: '',
      isPasswordModalOpen: false
    };
  }

  onChangePassword = (password: string): void => {
    this.setState({
      password,
      error: undefined
    });
  }

  onDiscard = (): void => {
    this.setState(this.emptyState());
  }
}

export {
  UploadButton
};

export default translate(UploadButton);
