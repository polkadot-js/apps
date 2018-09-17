// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps, BareProps } from '@polkadot/ui-app/types';

import React from 'react';
import AddressMini from '@polkadot/ui-app/AddressMini';
import AddressSummary from '@polkadot/ui-app/AddressSummary';
import Button from '@polkadot/ui-app/Button';
import CopyButton from '@polkadot/ui-app/CopyButton';
import Modal from '@polkadot/ui-app/Modal';
import classes from '@polkadot/ui-app/util/classes';
import keyring from '@polkadot/ui-keyring/index';
import Unlock from '@polkadot/ui-signer/Unlock';

import translate from './translate';

type Props = I18nProps & BareProps & {
  address: string,
  error?: React.ReactNode,
  handleDownloadAccount: () => void,
  hideModal: () => void,
  isOpen: boolean,
  onChangePassword: (password: string) => void,
  onDiscard: () => void,
  password: string
};

class DownloadModal extends React.PureComponent<Props> {
  render () {
    const { address, className, hideModal, isOpen, style, t } = this.props;

    return (
      <Modal
        className={classes('accounts--DownloadModal', className)}
        dimmer='inverted'
        open={isOpen}
        onClose={hideModal}
        size='mini'
        style={style}
      >
        <Modal.Content>
          <div className='ui--grid'>
            <div className='accounts--DownloadModal-Content'>
              <AddressMini
                isShort
                value={address}
              >
                <CopyButton />
              </AddressMini>
              <AddressSummary
                withBalance={false}
                withNonce={false}
                value={address}
              />
              <div className='accounts--DownloadModal-Content-message expanded'>
                <p>
                  {t('download.unlock.info', {
                    defaultValue: 'Please enter your account password to unlock and download a decrypted backup.'
                  })}
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
        tabIndex={1}
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
            tabIndex={3}
            text={t('creator.discard', {
              defaultValue: 'Cancel'
            })}
          />
          <Button.Or />
          <div>
            <Button
              className='accounts--DownloadModal-Actions-Submit'
              isPrimary
              onClick={handleDownloadAccount}
              tabIndex={2}
              text={t('creator.submit', {
                defaultValue: 'Submit'
              })}
            />
          </div>
        </Button.Group>
      </Modal.Actions>
    );
  }
}

export {
  DownloadModal
};

export default translate(DownloadModal);
