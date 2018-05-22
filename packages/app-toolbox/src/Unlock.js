// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-app/types';
import type { KeyringPair } from '@polkadot/util-keyring/types';

import React from 'react';
import { Trans } from 'react-i18next';

import Button from '@polkadot/ui-app/Button';
import Modal from '@polkadot/ui-app/Modal';
import Password from '@polkadot/ui-app/Password';
import classes from '@polkadot/ui-app/util/classes';
import IdentityIcon from '@polkadot/ui-react/IdentityIcon';

import translate from './translate';

type Props = I18nProps & {
  isVisible: boolean,
  onClose: () => void,
  pair: KeyringPair
};

type UnlockI18n = {
  key: string,
  value: I18Next$Translate$Config
}

type State = {
  address: string,
  password: string,
  unlockError: UnlockI18n | null
};

class Unlock extends React.PureComponent<Props, State> {
  state: State = {
    address: '',
    password: '',
    unlockError: null
  };

  static getDerivedStateFromProps ({ pair }: Props, prevState: State): $Shape<State> {
    const address = pair
      ? pair.address()
      : '';

    const isSame = address !== prevState.address;

    return {
      address,
      password: isSame
        ? prevState.password
        : '',
      unlockError: isSame
        ? prevState.unlockError
        : null
    };
  }

  render (): React$Node {
    const { className, isVisible, style, t } = this.props;

    if (!isVisible) {
      return null;
    }

    return (
      <Modal
        className={classes('toolbox--Unlock', className)}
        dimmer='inverted'
        open
        style={style}
      >
        <Modal.Header>
          {t('unlock.header', {
            defaultValue: 'Unlock account'
          })}
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

  renderActions (): React$Node {
    const { t } = this.props;

    return (
      <Button.Group>
        <Button
          isNegative
          onClick={this.onCancel}
          text={t('unlock.cancel', {
            defaultValue: 'Cancel'
          })}
        />
        <Button.Or />
        <Button
          isPrimary
          onClick={this.onUnlock}
          text={t('unlock.doit', {
            defaultValue: 'Unlock'
          })}
        />
      </Button.Group>
    );
  }

  renderContent (): React$Node {
    const { t } = this.props;
    const { address, password, unlockError } = this.state;

    return [
      <div className='toolbox--Unlock-Content' key='content'>
        <div className='expanded'>
          <p>
            <Trans i18nkey='unlock.info'>
              You are about to unlock your account <span className='code'>{address}</span> to allow for the signing of messages.
            </Trans>
          </p>
        </div>
        <IdentityIcon
          className='icon'
          value={address}
        />
      </div>,
      <div className='toolbox--Unlock-Entry' key='entry'>
        <div className='ui--row'>
          <Password
            className='medium'
            isError={!!unlockError}
            label={t('unlock.password', {
              defaultValue: 'unlock account using'
            })}
            onChange={this.onChangePassword}
            value={password}
          />
        </div>
      </div>
    ];
  }

  unlockAccount (password?: string): ?UnlockI18n {
    const { pair } = this.props;

    if (pair.hasSecretKey()) {
      return null;
    }

    try {
      pair.decodePkcs8(password);
    } catch (error) {
      return {
        key: 'unlock.generic',
        value: {
          defaultValue: error.message
        }
      };
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
  };
}

export default translate(Unlock);
