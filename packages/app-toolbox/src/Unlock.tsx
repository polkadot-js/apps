// Copyright 2017-2019 @polkadot/app-toolbox authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { KeyringPair } from '@polkadot/keyring/types';

import React from 'react';
import { AddressRow, Button, Modal, Password, TxComponent } from '@polkadot/ui-app';

import translate from './translate';

type Props = I18nProps & {
  onClose: () => void,
  pair: KeyringPair | null
};

type State = {
  address: string,
  password: string,
  unlockError: string | null
};

class Unlock extends TxComponent<Props, State> {
  state: State = {
    address: '',
    password: '',
    unlockError: null
  };

  static getDerivedStateFromProps ({ pair }: Props): State {
    return {
      address: (pair && pair.address) || ''
    } as State;
  }

  render () {
    const { pair, t } = this.props;

    if (!pair) {
      return null;
    }

    return (
      <Modal
        className='toolbox--Unlock'
        dimmer='inverted'
        open
      >
        <Modal.Header>
          {t('Unlock account')}
        </Modal.Header>
        {this.renderContent()}
        {this.renderActions()}
      </Modal>
    );
  }

  private renderActions () {
    const { t } = this.props;

    return (
      <Modal.Actions>
        <Button.Group>
          <Button
            isNegative
            onClick={this.onCancel}
            label={t('Cancel')}
          />
          <Button.Or />
          <Button
            isPrimary
            onClick={this.onUnlock}
            label={t('Unlock')}
            ref={this.button}
          />
        </Button.Group>
      </Modal.Actions>
    );
  }

  private renderContent () {
    const { t } = this.props;
    const { address, password, unlockError } = this.state;

    return (
      <Modal.Content>
        <AddressRow
          isInline
          value={address}
        >
          <p>{t('You are about to unlock your account to allow for the signing of messages. Once active the signature will be generated based on the content provided.')}</p>
          <div>
            <Password
              autoFocus
              isError={!!unlockError}
              help={t('The account\'s password specified at the creation of this account.')}
              label={t('password')}
              onChange={this.onChangePassword}
              onEnter={this.submit}
              value={password}
            />
          </div>
        </AddressRow>
      </Modal.Content>
    );
  }

  private unlockAccount (password?: string): string | null {
    const { pair } = this.props;

    if (!pair || !pair.isLocked) {
      return null;
    }

    try {
      pair.decodePkcs8(password);
    } catch (error) {
      return error.message;
    }

    return null;
  }

  private onChangePassword = (password: string): void => {
    this.setState({
      password,
      unlockError: null
    });
  }

  private onCancel = (): void => {
    const { onClose } = this.props;

    onClose();
  }

  private onUnlock = (): void => {
    const { onClose } = this.props;
    const { password } = this.state;
    const unlockError = this.unlockAccount(password);

    if (unlockError) {
      this.setState({ unlockError });
      return;
    }

    onClose();
  }
}

export default translate(Unlock);
