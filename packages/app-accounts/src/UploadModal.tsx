// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps, BareProps } from '@polkadot/ui-app/types';
import { KeyringPair$Json } from '@polkadot/util-keyring/types';

import React from 'react';
import { Trans } from 'react-i18next';
import Button from '@polkadot/ui-app/Button';
import Modal from '@polkadot/ui-app/Modal';
import classes from '@polkadot/ui-app/util/classes';
import keyring from '@polkadot/ui-keyring/index';
import Unlock from '@polkadot/ui-signer/Unlock';
import isUndefined from '@polkadot/util/is/undefined';

import translate from './translate';

type Props = I18nProps & BareProps & {
  address?: string,
  error?: React.ReactNode,
  hidePasswordModal: () => void,
  isPasswordModalOpen: boolean,
  onChangePassword: (password: string) => void,
  onDiscard: () => void,
  password: string,
  processUploadedFileStorage: () => void,
  uploadedFileKeyringPair: KeyringPair$Json | undefined
};

class UploadModal extends React.PureComponent<Props> {
  render () {
    const { address, className, hidePasswordModal, isPasswordModalOpen, style } = this.props;

    return (
      <Modal
        className={classes('ui--accounts-upload-Signer', className)}
        dimmer='inverted'
        open={address && isPasswordModalOpen ? true : false}
        onClose={hidePasswordModal}
        size='mini'
        style={style}
      >
        <Modal.Content>
          <div className='ui--grid'>
            <div className='accounts--Address-modal'>
              <div className='accounts--Address-modal-message expanded'>
                <p>
                  <Trans i18nKey='unlock.info'>
                    Please enter your account password to upload and restore it encrypted.
                  </Trans>
                </p>
              </div>
              {this.renderContent()}
            </div>
            {this.renderButtons()}
          </div>
        </Modal.Content>
      </Modal>
    );
  }

  renderContent () {
    const { error, onChangePassword, password, uploadedFileKeyringPair } = this.props;

    if (isUndefined(uploadedFileKeyringPair) || !uploadedFileKeyringPair.address) {
      return null;
    }

    const keyringAddress = keyring.getAddress(uploadedFileKeyringPair.address);

    return (
      <Unlock
        autoFocus
        error={error}
        onChange={onChangePassword}
        password={password}
        tabIndex='1'
        value={keyringAddress.publicKey()}
      />
    );
  }

  renderButtons () {
    const { onDiscard, processUploadedFileStorage, t } = this.props;

    return (
      <Modal.Actions>
        <Button.Group>
          <Button
            isNegative
            onClick={onDiscard}
            tabIndex='3'
            text={t('creator.discard', {
              defaultValue: 'Cancel'
            })}
          />
          <Button.Or />
          <Button
            isPrimary
            onClick={processUploadedFileStorage}
            tabIndex='2'
            text={t('creator.submit', {
              defaultValue: 'Submit'
            })}
          />
        </Button.Group>
      </Modal.Actions>
    );
  }
}

export {
  UploadModal
};

export default translate(UploadModal);
