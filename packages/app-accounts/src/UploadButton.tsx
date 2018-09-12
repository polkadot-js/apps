// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps, I18nProps } from '@polkadot/ui-app/types';
import { KeyringPair, KeyringPair$Json } from '@polkadot/util-keyring/types';

import React from 'react';
import { InputAddress } from '@polkadot/ui-app/InputAddress';
import arrayContainsArray from '@polkadot/ui-app/util/arrayContainsArray';
import isUndefined from '@polkadot/util/is/undefined';
import keyring from '@polkadot/ui-keyring/index';

import AccountsFile from './AccountsFile';
import UploadModal from './UploadModal';
import translate from './translate';

const createBlob = (fileBytes: Uint8Array): Blob =>
  new Blob([fileBytes], { type: 'text/plain;charset=utf-8' });
const expectedJsonProperties: Array<string> = ['address', 'encoding', 'meta'];
const fileReader = new FileReader();

type State = {
  address: string,
  error?: React.ReactNode,
  isPasswordModalOpen: boolean,
  password: string,
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

    const blob: Blob = createBlob(fileBytes);

    fileReader.onload = (event) => {
      try {
        if (!isUndefined(event) && event.target !== null) {
          // Cast to type 'any' since property 'result' does exist on type 'EventTarget'
          // Reference: https://stackoverflow.com/a/45017155/3208553
          const uploadedFileKeyringPair: KeyringPair$Json = JSON.parse((event.target as any).result);
          const actualJsonProperties: Array<string> = Object.keys(uploadedFileKeyringPair);

          if (arrayContainsArray(actualJsonProperties, expectedJsonProperties)) {
            keyring.loadAccount(uploadedFileKeyringPair);

            // Store uploaded wallet in state and open modal to get their password for it
            this.setState({
              uploadedFileKeyringPair
            }, () =>
              this.showPasswordModal()
            );
          } else {
            throw Error('Unable to load account with invalid JSON property names');
          }
        }
      } catch (error) {
        console.error('Error uploading file: ', error);
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

    try {
      if (!uploadedFileKeyringPair || !Object.keys(uploadedFileKeyringPair).length) {
        return;
      }

      const pairRestored: KeyringPair | undefined = keyring.restoreAccount(uploadedFileKeyringPair, password);

      if (pairRestored) {
        this.hidePasswordModal();

        InputAddress.setLastValue('account', pairRestored.address());

        onChangeAccount(pairRestored.publicKey());
      } else {
        this.setState({
          error: t('upload.error.memory', {
            defaultValue: 'Unable to upload account into memory'
          })
        });
      }
    } catch (error) {
      console.error('Error processing uploaded file to local storage: ', error);
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
      <div className='accounts--UploadButton'>
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
        <AccountsFile
          className='accounts--UploadButton-File'
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
