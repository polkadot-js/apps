// Copyright 2017-2018 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps, BareProps } from '@polkadot/ui-app/types';

import React from 'react';
import { Trans } from 'react-i18next';
import AddressMini from '@polkadot/ui-app/AddressMini';
import Button from '@polkadot/ui-app/Button';
import Modal from '@polkadot/ui-app/Modal';
import classes from '@polkadot/ui-app/util/classes';
import keyring from '@polkadot/ui-keyring/index';
import Unlock from '@polkadot/ui-signer/Unlock';

import translate from './translate';

type Props = I18nProps & BareProps & {
  address: string,
  error?: React.ReactNode,
  handleDownloadAccount: () => void,
  hidePasswordModal: () => void,
  isPasswordModalOpen: boolean,
  onChangePassword: (password: string) => void,
  onDiscard: () => void,
  password: string
};

export class DownloadModal extends React.PureComponent<Props> {
  render () {
    const { address, className, hidePasswordModal, isPasswordModalOpen, style } = this.props;

    return (
      <Modal
        className={classes('ui--accounts-download-Signer', className)}
        dimmer='inverted'
        open={isPasswordModalOpen}
        onClose={hidePasswordModal}
        size='mini'
        style={style}
      >
        <Modal.Content>
          <div className='ui--grid'>
            <div className='accounts--Address-modal'>
              <AddressMini
                isShort
                value={address}
              />
              <div className='accounts--Address-modal-message expanded'>
                <p>
                  <Trans i18nKey='unlock.info'>
                    Please enter your account password to unlock and download a decrypted backup.
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
    const { address, error, onChangePassword, password } = this.props;

    if (!address) {
      return null;
    }

    const keyringAddress = keyring.getAddress(address);

    return (
      <Unlock
        autoFocus
        error={error}
        onChange={onChangePassword}
        password={password}
        value={keyringAddress.publicKey()}
      />
    );
  }

  renderButtons () {
    const { handleDownloadAccount, onDiscard, t } = this.props;

    return (
      <Modal.Actions>
        <Button.Group>
          <Button
            isNegative
            onClick={onDiscard}
            text={t('creator.discard', {
              defaultValue: 'Cancel'
            })}
          />
          <Button.Or />
          <Button
            isPrimary
            className='ui--Button-submit'
            onClick={handleDownloadAccount}
            text={t('creator.submit', {
              defaultValue: 'Submit'
            })}
          />
        </Button.Group>
      </Modal.Actions>
    );
  }
}

export default translate(DownloadModal);
