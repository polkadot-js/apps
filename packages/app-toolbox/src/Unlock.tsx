// Copyright 2017-2019 @polkadot/app-toolbox authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { KeyringPair } from '@polkadot/keyring/types';

import React from 'react';
import styled from 'styled-components';
import { Trans } from 'react-i18next';
import { Button, IdentityIcon, Modal, Password } from '@polkadot/ui-app';

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

const WrapperContent = styled.div`
  align-content: center;
  display: flex;
  line-height: 1.5em;

  .expanded {
    padding-right: 2em;

    .code {
      background: #f5f5f5;
      font-family: monospace;
      margin: 0 0.25em;
      overflow-wrap: break-word;
      padding: 0.25em 0.5em;
      word-break: break-all;
      word-break: break-word;
      word-wrap: break-word;
    }
  }
`;

const WrapperEntry = styled.div`
  padding-top: 1.5rem;
`;

class Unlock extends React.PureComponent<Props, State> {
  state: State = {
    address: '',
    password: '',
    unlockError: null
  };

  static getDerivedStateFromProps ({ pair }: Props, prevState: State): State {
    return {
      address: pair
        ? pair.address()
        : ''
    } as State;
  }

  render () {
    const { t } = this.props;

    return (
      <Modal
        className='toolbox--Unlock'
        dimmer='inverted'
        open
      >
        <Modal.Header>
          {t('Unlock account')}
        </Modal.Header>
        <Modal.Content>
          {this.renderContent()}
        </Modal.Content>
        <Modal.Actions>
          {this.renderActions()}
        </Modal.Actions>
      </Modal>
    );
  }

  renderActions () {
    const { t } = this.props;

    return (
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
        />
      </Button.Group>
    );
  }

  renderContent () {
    const { t } = this.props;
    const { address, password, unlockError } = this.state;

    return (
      <>
        <WrapperContent>
          <div className='expanded'>
            <p>
              <Trans>
                You are about to unlock your account <span className='code'>{address}</span> to allow for the signing of messages.
              </Trans>
            </p>
          </div>
          <IdentityIcon
            className='icon'
            value={address}
          />
        </WrapperContent>
        <WrapperEntry>
          <div className='ui--row'>
            <Password
              className='medium'
              isError={!!unlockError}
              label={t('unlock account using')}
              onChange={this.onChangePassword}
              value={password}
            />
          </div>
        </WrapperEntry>
      </>
    );
  }

  unlockAccount (password?: string): string | null {
    const { pair } = this.props;

    if (!pair || !pair.isLocked()) {
      return null;
    }

    try {
      pair.decodePkcs8(password);
    } catch (error) {
      return error.message;
    }

    return null;
  }

  onChangePassword = (password: string): void => {
    this.setState({
      password,
      unlockError: null
    });
  }

  onCancel = (): void => {
    const { onClose } = this.props;

    onClose();
  }

  onUnlock = (): void => {
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
