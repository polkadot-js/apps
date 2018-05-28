// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { EncodingVersions } from '@polkadot/extrinsics-codec/types';
import type { ApiProps } from '@polkadot/ui-react-rx/types';
import type { I18nProps } from '@polkadot/ui-app/types';
import type { QueueTx, QueueTx$MessageSetStatus } from './types';

import React from 'react';

import Button from '@polkadot/ui-app/Button';
import Modal from '@polkadot/ui-app/Modal';
import classes from '@polkadot/ui-app/util/classes';
import keyring from '@polkadot/ui-keyring';
import withApi from '@polkadot/ui-react-rx/with/api';

import Extrinsic from './Extrinsic';
import Unlock from './Unlock';
import signMessage from './sign';
import submitMessage from './submit';
import translate from './translate';

type Props = I18nProps & ApiProps & {
  queue: Array<QueueTx>,
  queueSetStatus: QueueTx$MessageSetStatus
};

type UnlockI18n = {
  key: string,
  value: I18Next$Translate$Config
}

type State = {
  apiSupport: EncodingVersions,
  currentItem?: QueueTx,
  password: string,
  unlockError: UnlockI18n | null
};

class Signer extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      apiSupport: 'poc-1',
      password: '',
      unlockError: null
    };
  }

  static getDerivedStateFromProps ({ queue }: Props, { apiSupport, currentItem, password, unlockError }: State): State {
    const nextItem = queue.find(({ status }) =>
      status === 'queued'
    );
    const isSame =
      !!nextItem &&
      !!currentItem &&
      (
        (!nextItem.publicKey && !currentItem.publicKey) ||
        (
          (nextItem.publicKey && nextItem.publicKey.toString()) === (currentItem.publicKey && currentItem.publicKey.toString())
        )
      );

    return {
      apiSupport,
      currentItem: nextItem,
      password: isSame ? password : '',
      unlockError: isSame ? unlockError : null
    };
  }

  componentDidMount () {
    // FIXME should be shared component, no unmount here
    this.props.api.system.version().subscribe((nodeVersion?: string) => {
      this.setState({
        apiSupport: nodeVersion === undefined || nodeVersion === '0.1.0'
          ? 'poc-1'
          : 'latest'
      });
    });
  }

  componentDidUpdate (prevProps: Props, prevState: State) {
    const { currentItem } = this.state;

    if (currentItem && currentItem.status === 'queued' && currentItem.rpc.isSigned !== true) {
      this.sendItem(currentItem);
    }
  }

  render (): React$Node {
    const { className, style } = this.props;
    const { currentItem } = this.state;

    if (!currentItem || currentItem.rpc.isSigned !== true) {
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
        {this.renderButtons()}
      </Modal>
    );
  }

  renderButtons (): React$Node {
    const { t } = this.props;
    const { currentItem: { rpc: { isSigned = false } = {} } = {} } = this.state;

    return (
      <Modal.Actions>
        <Button.Group>
          <Button
            isNegative
            onClick={this.onCancel}
            text={t('extrinsic.cancel', {
              defaultValue: 'Cancel'
            })}
          />
          <Button.Or />
          <Button
            isPrimary
            onClick={this.onSend}
            text={
              isSigned
                ? t('extrinsic.signedSend', {
                  defaultValue: 'Sign and Submit'
                })
                : t('extrinsic.send', {
                  defaultValue: 'Submit'
                })
            }
          />
        </Button.Group>
      </Modal.Actions>
    );
  }

  renderContent (): React$Node {
    const { currentItem } = this.state;

    if (!currentItem) {
      return null;
    }

    return (
      <Extrinsic value={currentItem}>
        {this.renderUnlock()}
      </Extrinsic>
    );
  }

  renderUnlock (): React$Node {
    const { t } = this.props;
    const { currentItem, password, unlockError } = this.state;

    if (!currentItem) {
      return null;
    }

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

  onSend = (): void => {
    const { currentItem, password } = this.state;

    // This should never be executed
    if (!currentItem) {
      return;
    }

    this.sendItem(currentItem, password);
  };

  sendItem = async ({ id, nonce, publicKey, rpc, values }: QueueTx, password?: string): Promise<void> => {
    if (rpc.isSigned === true && publicKey) {
      const unlockError = this.unlockAccount(publicKey, password);

      if (unlockError) {
        this.setState({ unlockError });
        return;
      }
    }

    const { api, queueSetStatus } = this.props;
    const { apiSupport } = this.state;

    queueSetStatus(id, 'sending');

    let data = values;

    if (rpc.isSigned === true && publicKey) {
      data = [
        signMessage(
          // flowlint-next-line unclear-type:off
          publicKey, nonce, ((data[0]: any): Uint8Array), apiSupport
        ).data
      ];
    }

    const { error, result, status } = await submitMessage(api, data, rpc);

    queueSetStatus(id, status, result, error);
  }
}

export default translate(
  withApi(Signer)
);
