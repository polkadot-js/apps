// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Button$Sizes } from '@polkadot/ui-app/Button/types';
import { BareProps, I18nProps, InputErrorMessage } from '@polkadot/ui-app/types';
import { KeyringPair$Json } from '@polkadot/util-keyring/types';

import React from 'react';
import translate from './translate';
import { Trans } from 'react-i18next';
import ReactFileReader from 'react-file-reader';
import IdentityIcon from '@polkadot/ui-react/IdentityIcon';
import isUndefined from '@polkadot/util/is/undefined';
import keyring from '@polkadot/ui-keyring/index';

import Button from '@polkadot/ui-app/Button';
import Modal from '@polkadot/ui-app/Modal';
import toShortAddress from '@polkadot/ui-app/util/toShortAddress';
import Unlock from '@polkadot/ui-signer/Unlock';

type State = {
  address: string,
  password: string,
  isPasswordModalOpen: boolean,
  error?: InputErrorMessage,
  uploadedFileKeyringPair: KeyringPair$Json | undefined
};

type Props = I18nProps & BareProps & {
  icon?: string,
  isCircular?: boolean,
  isPrimary?: boolean,
  size?: Button$Sizes,
  onChangeAccount: any
};

class UploadButton extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = this.emptyState();
  }

  handleUploadedFiles = (files: FileList): void => {
    const { t } = this.props;
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

            keyring.addFromJson(json as KeyringPair$Json);

            // Store uploaded wallet in state and open modal to get their password for it
            this.setState({ uploadedFileKeyringPair: json }, () => this.showPasswordModal());
          }
        }
      } catch (e) {
        console.error('Error uploading file: ', e);
        this.setState({ error: { key: t('error'), value: t('Unable to upload account from file') } });
      }
    };

    fileReader.readAsText(fileToUpload);
  }

  processUploadedFileStorage = (): void => {
    const { password, uploadedFileKeyringPair } = this.state;
    const { t, onChangeAccount } = this.props;

    if (isUndefined(uploadedFileKeyringPair) || !uploadedFileKeyringPair.address) {
      return;
    }

    const json = uploadedFileKeyringPair;

    // Reset password so it is not pre-populated on the form on subsequent uploads
    this.setState({ password: '' }, () => {
      try {
        if (!json || !Object.keys(json).length) {
          return;
        }

        const pairRestored = keyring.restoreAccount(json, password);

        if (pairRestored) {
          this.hidePasswordModal();
          onChangeAccount(pairRestored.publicKey());

          return;
        } else {
          this.setState({ error: { key: t('error'), value: t('Unable to upload account into memory') } });

          return;
        }
      } catch (e) {
        console.error('Error processing uploaded file to local storage: ', e);
        this.setState({ error: { key: t('error'), value: t('Unable to upload account into memory') } });

        return;
      }
    });

    return;
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
      shortValue = toShortAddress(address);
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
                  <div className={'accounts--Address-modal'}>
                    <IdentityIcon
                      className='accounts--Address-modal-icon'
                      size={48}
                      value={address}
                    />
                    <div className='accounts--Address-modal-data'>
                      <div className='accounts--Address-modal-address'>
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
        <ReactFileReader
          fileTypes={['.json']}
          base64={false}
          multipleFiles={false}
          handleFiles={this.handleUploadedFiles}
        >
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
    const { uploadedFileKeyringPair, password, error } = this.state;
    let translateError: InputErrorMessage | undefined = undefined;

    if (isUndefined(uploadedFileKeyringPair) || !uploadedFileKeyringPair.address) {
      return null;
    }

    const keyringAddress = keyring.getAddress(uploadedFileKeyringPair.address);

    if (error && error.key && error.value) {
      translateError = {
        key: t(error.key),
        value: t(error.value)
      };
    }

    return (
      <Unlock
        autoFocus={true}
        error={translateError || undefined}
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
            onClick={this.processUploadedFileStorage}
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
      error: undefined,
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
          error = prevState.error,
          uploadedFileKeyringPair = prevState.uploadedFileKeyringPair
        } = newState;

        return {
          address,
          password,
          isPasswordModalOpen,
          error,
          uploadedFileKeyringPair
        };
      }
    );
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

export default translate(UploadButton);
