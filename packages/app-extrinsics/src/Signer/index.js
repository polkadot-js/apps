// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { ApiProps } from '@polkadot/ui-react-rx/types';
import type { I18nProps } from '@polkadot/ui-app/types';
import type { QueueTx } from '../types';

import './Signer.css';

import React from 'react';

import Button from '@polkadot/ui-app/src/Button';
import Modal from '@polkadot/ui-app/src/Modal';
import classes from '@polkadot/ui-app/src/util/classes';
import keyring from '@polkadot/ui-keyring/src';
import withApi from '@polkadot/ui-react-rx/with/api';

import translate from '../translate';
import Decoded from './Decoded';
import Unlock from './Unlock';
import submitExtrinsic from './submit';

type Props = I18nProps & ApiProps & {
  onSetStatus: (id: number, status: string) => void,
  queue: Array<QueueTx>
};

type UnlockI18n = {
  key: string,
  value: I18Next$Translate$Config
}

type State = {
  currentItem?: QueueTx,
  password: string,
  unlockError: UnlockI18n | null
};

class Signer extends React.PureComponent<Props, State> {
  state: State = {
    password: '',
    unlockError: null
  };

  static getDerivedStateFromProps ({ queue }: Props, { currentItem, password, unlockError }: State): $Shape<State> {
    const nextItem = queue.find(({ status }) =>
      status === 'queued'
    );
    const isSame =
      !!nextItem &&
      !!currentItem &&
      nextItem.publicKey.toString() === currentItem.publicKey.toString();

    return {
      currentItem: nextItem,
      password: isSame ? password : '',
      unlockError: isSame ? unlockError : null
    };
  }

  render (): React$Node {
    const { className, style, t } = this.props;
    const { currentItem, password, unlockError } = this.state;

    if (!currentItem) {
      return null;
    }

    return (
      <Modal
        className={classes('extrinsics--Signer', className)}
        dimmer='inverted'
        open
        style={style}
      >
        <Modal.Header>
          {t('signer.header', {
            defaultValue: 'Extrinsic submission'
          })}
        </Modal.Header>
        <Modal.Content className='extrinsics--Signer-Content'>
          <Decoded value={currentItem} />
          <Unlock
            error={unlockError && t(unlockError.key, unlockError.value)}
            onChange={this.onChangePassword}
            password={password}
            value={currentItem.publicKey}
          />
        </Modal.Content>
        <Modal.Actions>
          <Button.Group>
            <Button
              isNegative
              onClick={this.onCancel}
              text={t('signer.cancel', {
                defaultValue: 'Cancel'
              })}
            />
            <Button.Or />
            <Button
              isPrimary
              onClick={this.onSign}
              text={t('signer.send', {
                defaultValue: 'Sign and Submit'
              })}
            />
          </Button.Group>
        </Modal.Actions>
      </Modal>
    );
  }

  unlockAccount (publicKey: Uint8Array, password?: string): ?UnlockI18n {
    const pair = keyring.getPair(publicKey);

    if (pair.hasSecretKey()) {
      return null;
    }

    try {
      // $FlowFixMe typo in underlying type, fixed at base (upgrades)
      pair.decodePkcs8(void 0, password);
    } catch (error) {
      return {
        key: 'signer.unlock.generic',
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
    const { onSetStatus } = this.props;
    const { currentItem } = this.state;

    // This should never be executed
    if (!currentItem) {
      return;
    }

    onSetStatus(currentItem.id, 'cancelled');
  }

  onSign = async (): Promise<void> => {
    const { api, onSetStatus } = this.props;
    const { currentItem, password } = this.state;

    // This should never be executed
    if (!currentItem) {
      return;
    }

    const unlockError = this.unlockAccount(currentItem.publicKey, password);

    if (unlockError) {
      this.setState({ unlockError });
      return;
    }

    onSetStatus(currentItem.id, 'sending');
    onSetStatus(currentItem.id, await submitExtrinsic(api, currentItem));
  };
}

export default translate(
  withApi(Signer)
);
