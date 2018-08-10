// Copyright 2017-2018 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Button$Sizes } from '@polkadot/ui-app/Button/types';
import { BareProps, I18nProps } from '@polkadot/ui-app/types';
import { KeyringPair$Json } from '@polkadot/util-keyring/types';

import React from 'react';
import translate from './translate';
import { Trans } from 'react-i18next';
import FileSaver from 'file-saver';
import keyring from '@polkadot/ui-keyring/index';
import isUndefined from '@polkadot/util/is/undefined';

import AddressMini from '@polkadot/ui-app/AddressMini';
import Button from '@polkadot/ui-app/Button';
import Modal from '@polkadot/ui-app/Modal';
import Unlock from '@polkadot/ui-signer/Unlock';

type State = {
  address: string,
  password: string,
  isPasswordModalOpen: boolean,
  error?: React.ReactNode
};

type Props = I18nProps & BareProps & {
  icon?: string,
  isCircular?: boolean,
  isPrimary?: boolean,
  size?: Button$Sizes,
  address: string
};

class DownloadButton extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = this.emptyState();
  }

  handleDownloadAccount = (): void => {
    const { t } = this.props;
    const { address, password } = this.state;

    if (!address) {
      return;
    }

    try {
      const json: KeyringPair$Json | void = keyring.backupAccount(address, password);

      if (!isUndefined(json)) {
        const blob = new Blob([JSON.stringify(json)], { type: 'text/plain;charset=utf-8' });

        FileSaver.saveAs(blob, `${address}.json`);

        this.hidePasswordModal();
      } else {
        this.setState({
          error: React.createElement(
            'div',
            t('error', { defaultValue: 'Unable to obtain account from memory' }),
            null
          )
        });
      }
    } catch (e) {
      this.setState({
        // https://www.reactenlightenment.com/react-nodes/4.2.html
        error: React.createElement(
          'div',
          t('error', { defaultValue: 'Unable to save file' }),
          null
        )
      });
      console.error('Error retrieving account from local storage and saving account to file: ', e);
    }
  }

  showPasswordModal = (): void => {
    const { address } = this.props;

    this.setState({
      isPasswordModalOpen: true,
      address: address,
      password: ''
    });
  }

  hidePasswordModal = (): void => {
    this.setState({ isPasswordModalOpen: false });
  }

  render () {
    const { address, isPasswordModalOpen } = this.state;
    const { className, icon = 'download', isCircular = true, isPrimary = true, size = 'tiny', style } = this.props;

    if (!address) {
      return null;
    }

    return (
      <div className={'accounts--Address-download'}>
        <Modal
          dimmer='inverted'
          open={isPasswordModalOpen}
          onClose={this.hidePasswordModal}
          size={'mini'}
        >
          <Modal.Content>
            <div className='ui--grid'>
              <div className={'accounts--Address-modal'}>
                <AddressMini isShort value={address} />
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
        <Button
          className={className}
          icon={icon}
          isCircular={isCircular}
          isPrimary={isPrimary}
          onClick={this.showPasswordModal}
          size={size}
          style={style}
        />
      </div>
    );
  }

  renderContent () {
    const { address, error, password } = this.state;
    const { t } = this.props;

    if (!address) {
      return null;
    }

    const keyringAddress = keyring.getAddress(address);

    return (
      <Unlock
        autoFocus
        error={error}
        onChange={this.onChangePassword}
        password={password}
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
            isPrimary
            onClick={this.handleDownloadAccount}
            text={t('creator.submit', {
              defaultValue: 'Submit'
            })}
          />
        </Button.Group>
      </Modal.Actions>
    );
  }

  emptyState (): State {
    const { address } = this.props;

    return {
      address: address,
      password: '',
      isPasswordModalOpen: false,
      error: undefined
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

export default translate(DownloadButton);
