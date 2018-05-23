// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { ApiProps } from '@polkadot/ui-react-rx/types';
import type { I18nProps } from '@polkadot/ui-app/types';
import type { QueueTx, QueueTx$MessageSetStatus } from './types';

import React from 'react';

import Modal from '@polkadot/ui-app/Modal';
import classes from '@polkadot/ui-app/util/classes';
import keyring from '@polkadot/ui-keyring';
import withApi from '@polkadot/ui-react-rx/with/api';

import translate from './translate';
import Extrinsic from './Extrinsic';
import Unlock from './Unlock';

type Props = I18nProps & ApiProps & {
  queue: Array<QueueTx>,
  queueSetStatus: QueueTx$MessageSetStatus
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
    const { className, style } = this.props;
    const { currentItem } = this.state;

    if (!currentItem) {
      return null;
    }

    return (
      <Modal
        className={classes('ui--signer-Signer', className)}
        dimmer='inverted'
        open
        style={style}
      >
        {this.renderContent()}
      </Modal>
    );
  }

  renderContent (): React$Node {
    const { api } = this.props;
    const { currentItem } = this.state;

    return (
      <Extrinsic
        api={api}
        cancelTx={this.onCancel}
        sendTx={this.onSend}
        value={currentItem}
      >
        {this.renderUnlock()}
      </Extrinsic>
    );
  }

  renderUnlock (): React$Node {
    const { t } = this.props;
    const { currentItem, password, unlockError } = this.state;

    return (
      <Unlock
        error={unlockError && t(unlockError.key, unlockError.value)}
        onChange={this.onChangePassword}
        password={password}
        value={currentItem.publicKey}
      />
    );
  }

  unlockAccount (publicKey: Uint8Array, password?: string): ?UnlockI18n {
    const pair = keyring.getPair(publicKey);

    if (pair.hasSecretKey()) {
      return null;
    }

    try {
      pair.decodePkcs8(password);
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
    const { queueSetStatus } = this.props;
    const { currentItem } = this.state;

    // This should never be executed
    if (!currentItem) {
      return;
    }

    queueSetStatus(currentItem.id, 'cancelled');
  }

  onSend = async (submit: () => Promise<QueueTx$Status>): Promise<void> => {
    const { queueSetStatus } = this.props;
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

    queueSetStatus(currentItem.id, 'sending');

    const { status } = await submit();

    queueSetStatus(currentItem.id, status);
  };
}

export default translate(
  withApi(Signer)
);
