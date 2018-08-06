// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Button$Sizes } from './Button/types';
import { BareProps, I18nProps } from './types';
import { KeyringPair, KeyringPair$Json } from '@polkadot/util-keyring/types';
import { KeyringAddress } from '@polkadot/ui-keyring/types';

import './UploadButton.css';

import React from 'react';
import IdentityIcon from '@polkadot/ui-react/IdentityIcon';
import isUndefined from '@polkadot/util/is/undefined';
import ReactFileReader from 'react-file-reader';
import keyring from '@polkadot/ui-keyring/index';

import Button from './Button';
import Modal from './Modal';
import Unlock from '@polkadot/ui-signer/Unlock';

import translate from './translate';
import { Trans } from 'react-i18next';

type UnlockI18n = {
  key: string,
  value: string
};

type State = {
  address: string,
  password: string,
  isPasswordModalOpen: boolean,
  unlockError: UnlockI18n | null,
  uploadedFileKeyringPair: KeyringPair$Json | undefined
};

type Props = I18nProps & BareProps & {
  icon?: string,
  isCircular?: boolean,
  isPrimary?: boolean,
  size?: Button$Sizes,
  handleChangeAccount: any
};

class UploadButton extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = this.emptyState();
  }

  handleUploadedFiles = (files: FileList): void => {
    const fileList: FileList = files;

    if (!fileList || fileList && !fileList.length) {
      console.error('Error retrieving file list');
      return;
    }

    const fileToUpload: File = fileList[0];
    const fileReader: FileReader = new FileReader();

    fileReader.onload = (e) => {
      try {
        if (!isUndefined(e) && e.target !== null) {
          const fileContents: any = JSON.parse(e.target.result);

          if (Object.keys(fileContents).includes('address' && 'encoding' && 'meta')) {
            const json: KeyringPair$Json | undefined = fileContents;

            const pair: KeyringPair = keyring.addFromJson(json as KeyringPair$Json);

            console.log('Load account keyring pair using account JSON into keyring memory: ', pair);

            // Store uploaded wallet in state and open modal to get their password for it
            this.setState(
              { uploadedFileKeyringPair: json },
              () => this.showPasswordModal()
            );
          }
        }
      } catch (e) {
        console.error('Error uploading file: ', e);
        this.setState({ unlockError: { key: 'error', value: 'Unable to upload account from file' } });
      }
    };
    fileReader.readAsText(fileToUpload);
  }

  processUploadedFileStorage = (): boolean => {
    const { password, uploadedFileKeyringPair } = this.state;
    const { handleChangeAccount } = this.props;
    const json: KeyringPair$Json | undefined = uploadedFileKeyringPair;

    // Reset password so it is not pre-populated on the form on subsequent uploads
    this.setState(
      { password: '' },
      () => {
        try {
          if (json && Object.keys(json).length) {
            const pairRestored: KeyringPair | void = keyring.restoreAccount(json, password);
            if (pairRestored) {
              this.hidePasswordModal();

              handleChangeAccount(pairRestored.publicKey());

              return true;
            } else {
              this.setState({ unlockError: { key: 'error', value: 'Unable to upload account into memory' } });
              return false;
            }
          }
        } catch (e) {
          console.error('Error processing uploaded file to local storage: ', e);
          this.setState({ unlockError: { key: 'error', value: 'Unable to upload account into memory' } });
          return false;
        }
        return false;
      }
    );
    return false;
  }

  showPasswordModal = (): void => {
    this.setState({ isPasswordModalOpen: true });
  }

  hidePasswordModal = (): void => {
    this.setState({ isPasswordModalOpen: false });
  }

  render () {
    const { uploadedFileKeyringPair, isPasswordModalOpen } = this.state;
    const { className, icon = 'upload', isCircular = true, isPrimary = true, size = 'tiny', style } = this.props;
    let shortValue = '';
    const address = uploadedFileKeyringPair && uploadedFileKeyringPair.address;

    if (address) {
      // TODO - do not duplicate this from Address component. move into common utility for reuse
      shortValue = `${address.slice(0, 7)}…${address.slice(-7)}`;
    }

    // TODO - move Modal into separate component common to both DownloadButton and UploadButton

    return (
      <div className={'accounts--Address-upload'}>
        { address && isPasswordModalOpen ? (
            <Modal
              dimmer='inverted'
              open={isPasswordModalOpen}
              onClose={this.hidePasswordModal}
              size={'mini'}
            >
              <Modal.Content>
                <div className='ui--grid'>
                  <div className={'accounts--Address accounts--Address-modal'}>
                    <IdentityIcon
                      className='accounts--Address-icon'
                      size={48}
                      value={address}
                    />
                    <div className='accounts--Address-data'>
                      <div className='accounts--Address-address'>
                        {shortValue}
                      </div>
                    </div>
                    <div className='expanded'>
                      <p>
                        <Trans i18nKey='unlock.info'>
                          Please enter password for account <span className='code'>{shortValue}</span> to upload it encrypted.
                        </Trans>
                      </p>
                    </div>
                    {this.renderContent()}
                  </div>
                  {this.renderButtons()}
                </div>
              </Modal.Content>
            </Modal>
          ) : null
        }
        <ReactFileReader fileTypes={['.json']} base64={false} multipleFiles={false} handleFiles={this.handleUploadedFiles}>
          <Button
            className={className}
            icon={icon}
            isCircular={isCircular}
            isPrimary={isPrimary}
            size={size}
            style={style}
          />
        </ReactFileReader>
      </div>
    );
  }

  renderContent () {
    const { uploadedFileKeyringPair } = this.state;

    // FIXME - need to refresh the page after creating an account since the address won't be available
    if (isUndefined(uploadedFileKeyringPair) || !uploadedFileKeyringPair.address) {
      return null;
    }

    return (
      <div>
        { this.renderUnlock() }
      </div>
    );
  }

  renderUnlock () {
    const { t } = this.props;
    const { uploadedFileKeyringPair, password, unlockError } = this.state;
    let translateError = null;

    if (isUndefined(uploadedFileKeyringPair) || !uploadedFileKeyringPair.address) {
      return null;
    }

    const keyringAddress: KeyringAddress = keyring.getAddress(uploadedFileKeyringPair.address);

    if (unlockError && unlockError.key && unlockError.value) {
      translateError = {
        key: t(unlockError.key),
        value: t(unlockError.value)
      };
    }

    return (
      <Unlock
        error={translateError || null}
        onChange={this.onChangePassword}
        password={password}
        passwordWidth={'full'}
        value={keyringAddress.publicKey()}
      />
    );
  }

  renderButtons () {
    const { t } = this.props;

    return (
      <Modal.Actions>
        <Button.Group>
          <Button
            isNegative
            onClick={this.onDiscard}
            text={t('creator.discard', {
              defaultValue: 'Cancel'
            })}
          />
          <Button.Or />
          <Button
            isDisabled={false}
            isPrimary
            onClick={this.onSubmit}
            text={t('creator.submit', {
              defaultValue: 'Submit'
            })}
          />
        </Button.Group>
      </Modal.Actions>
    );
  }

  emptyState (): State {
    return {
      address: '',
      password: '',
      isPasswordModalOpen: false,
      unlockError: null,
      uploadedFileKeyringPair: undefined
    };
  }

  nextState (newState: State): void {
    this.setState(
      (prevState: State, props: Props): State => {
        const {
          address = prevState.address,
          password = '',
          isPasswordModalOpen = prevState.isPasswordModalOpen,
          unlockError = prevState.unlockError,
          uploadedFileKeyringPair = prevState.uploadedFileKeyringPair
        } = newState;

        return {
          address,
          password,
          isPasswordModalOpen,
          unlockError,
          uploadedFileKeyringPair
        };
      }
    );
  }

  onChangePassword = (password: string): void => {
    this.nextState({ password, unlockError: null } as State);
    this.setState({
      password,
      unlockError: null
    });
  }

  onSubmit = (): void => {
    const { uploadedFileKeyringPair } = this.state;

    if (isUndefined(uploadedFileKeyringPair) || !uploadedFileKeyringPair.address) {
      return;
    }

    this.processUploadedFileStorage();
  }

  onDiscard = (): void => {
    this.setState(this.emptyState());
  }
}

export default translate(UploadButton);
