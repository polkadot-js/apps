// Copyright 2017-2019 @polkadot/app-toolbox authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { KeyringPair } from '@polkadot/keyring/types';

import React from 'react';
import { AddressRow, Button, Modal, Password, TxComponent } from '@polkadot/react-components';

import translate from './translate';

interface Props extends I18nProps {
  onClose: () => void;
  pair: KeyringPair | null;
}

interface State {
  address: string;
  password: string;
  unlockError: string | null;
}

class Unlock extends TxComponent<Props, State> {
  public state: State = {
    address: '',
    password: '',
    unlockError: null
  };

  public static getDerivedStateFromProps ({ pair }: Props): Pick<State, never> {
    return {
      address: (pair && pair.address) || ''
    };
  }

  public render (): React.ReactNode {
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

  private renderActions (): React.ReactNode {
    const { t } = this.props;

    return (
      <Modal.Actions>
        <Button.Group>
          <Button
            isNegative
            onClick={this.onCancel}
            label={t('Cancel')}
            icon='cancel'
          />
          <Button.Or />
          <Button
            isPrimary
            onClick={this.onUnlock}
            label={t('Unlock')}
            icon='unlock'
            ref={this.button}
          />
        </Button.Group>
      </Modal.Actions>
    );
  }

  private renderContent (): React.ReactNode {
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
