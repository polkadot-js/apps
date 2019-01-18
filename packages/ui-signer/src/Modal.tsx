// Copyright 2017-2019 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableSendResult } from '@polkadot/api/types';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { I18nProps, BareProps } from '@polkadot/ui-app/types';
import { RpcMethod } from '@polkadot/jsonrpc/types';
import { QueueTx, QueueTx$MessageSetStatus, QueueTx$Result, QueueTx$Status } from '@polkadot/ui-app/Status/types';

import React from 'react';
import { Button, Modal } from '@polkadot/ui-app/index';
import keyring from '@polkadot/ui-keyring';
import { withApi, withMulti } from '@polkadot/ui-api/index';
import { assert } from '@polkadot/util';
import { format } from '@polkadot/util/logger';

import Transaction from './Transaction';
import Unlock from './Unlock';
import translate from './translate';

type BaseProps = BareProps & {
  queue: Array<QueueTx>,
  queueSetTxStatus: QueueTx$MessageSetStatus
};

type Props = I18nProps & ApiProps & BaseProps;

type UnlockI18n = {
  key: string,
  value: any // I18Next$Translate$Config
};

type State = {
  currentItem?: QueueTx,
  password: string,
  unlockError: UnlockI18n | null
};

class Signer extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      password: '',
      unlockError: null
    };
  }

  static getDerivedStateFromProps ({ queue }: Props, { currentItem, password, unlockError }: State): State {
    const nextItem = queue.find(({ status }) =>
      status === 'queued'
    );
    const isSame =
      !!nextItem &&
      !!currentItem &&
      (
        (!nextItem.accountId && !currentItem.accountId) ||
        (
          (nextItem.accountId && nextItem.accountId.toString()) === (currentItem.accountId && currentItem.accountId.toString())
        )
      );

    return {
      currentItem: nextItem,
      password: isSame ? password : '',
      unlockError: isSame ? unlockError : null
    };
  }

  async componentDidUpdate () {
    const { currentItem } = this.state;

    if (currentItem && currentItem.status === 'queued' && !currentItem.extrinsic) {
      return this.sendRpc(currentItem);
    }
  }

  render () {
    const { currentItem } = this.state;

    if (!currentItem) {
      return null;
    }

    return (
      <Modal
        className='ui--signer-Signer'
        dimmer='inverted'
        open
      >
        {this.renderContent()}
        {this.renderButtons()}
      </Modal>
    );
  }

  private renderButtons () {
    const { t } = this.props;
    const { currentItem } = this.state;

    if (!currentItem) {
      return null;
    }

    return (
      <Modal.Actions>
        <Button.Group>
          <Button
            isNegative
            onClick={this.onCancel}
            tabIndex={3}
            text={t('extrinsic.cancel', {
              defaultValue: 'Cancel'
            })}
          />
          <Button.Or />
          <Button
            className='ui--signer-Signer-Submit'
            isPrimary
            onClick={this.onSend}
            tabIndex={2}
            text={
              currentItem.isUnsigned
                ? t('extrinsic.unsignedSend', {
                  defaultValue: 'Submit (no signature)'
                })
                : t('extrinsic.signedSend', {
                  defaultValue: 'Sign and Submit'
                })
            }
          />
        </Button.Group>
      </Modal.Actions>
    );
  }

  private renderContent () {
    const { currentItem } = this.state;

    if (!currentItem) {
      return null;
    }

    return (
      <Transaction value={currentItem}>
        {this.renderUnlock()}
      </Transaction>
    );
  }

  private renderUnlock () {
    const { t } = this.props;
    const { currentItem, password, unlockError } = this.state;

    if (!currentItem || currentItem.isUnsigned) {
      return null;
    }

    return (
      <Unlock
        autoFocus
        error={unlockError && t(unlockError.key, unlockError.value)}
        onChange={this.onChangePassword}
        onKeyDown={this.onKeyDown}
        password={password}
        value={currentItem.accountId}
        tabIndex={1}
      />
    );
  }

  private unlockAccount (accountId: string, password?: string): UnlockI18n | null {
    let publicKey;

    try {
      publicKey = keyring.decodeAddress(accountId);
    } catch (err) {
      console.error(err);
      return null;
    }

    const pair = keyring.getPair(publicKey);

    if (!pair.isLocked()) {
      return null;
    }

    try {
      pair.decodePkcs8(password);
    } catch (error) {
      console.error(error);
      return {
        key: 'signer.unlock.generic',
        value: {
          defaultValue: error.message
        }
      };
    }

    return null;
  }

  private onChangePassword = (password: string): void => {
    this.setState({
      password,
      unlockError: null
    });
  }

  private onKeyDown = async (event: React.KeyboardEvent<Element>) => {
    if (event.key === 'Enter') {
      await this.onSend();
    }
  }

  private onCancel = (): void => {
    const { queueSetTxStatus } = this.props;
    const { currentItem } = this.state;

    // This should never be executed
    if (!currentItem) {
      return;
    }

    queueSetTxStatus(currentItem.id, 'cancelled');
  }

  private onSend = async (): Promise<void> => {
    const { currentItem, password } = this.state;

    // This should never be executed
    if (!currentItem) {
      return;
    }

    return this.sendExtrinsic(currentItem, password);
  }

  private sendRpc = async ({ id, rpc, values = [] }: QueueTx): Promise<void> => {
    if (!rpc) {
      return;
    }

    const { queueSetTxStatus } = this.props;

    queueSetTxStatus(id, 'sending');

    const { error, result, status } = await this.submitRpc(rpc, values);

    queueSetTxStatus(id, status, result, error);
  }

  private async sendExtrinsic ({ accountId, extrinsic, id, isUnsigned }: QueueTx, password?: string): Promise<void> {
    assert(extrinsic, 'Expected an extrinsic to be supplied to sendExtrinsic');

    if (!isUnsigned) {
      assert(accountId, 'Expected an accountId with signed transactions');

      const unlockError = this.unlockAccount(accountId as string, password);

      if (unlockError) {
        this.setState({ unlockError });
        return;
      }
    }

    const submittable = extrinsic as SubmittableExtrinsic;
    const { queueSetTxStatus } = this.props;

    queueSetTxStatus(id, 'sending');

    if (!isUnsigned) {
      return this.makeExtrinsicCall(submittable, id, submittable.signAndSend, keyring.getPair(accountId as string));
    } else {
      return this.makeExtrinsicCall(submittable, id, submittable.send);
    }
  }

  private async submitRpc ({ method, section }: RpcMethod, values: Array<any>): Promise<QueueTx$Result> {
    const { api } = this.props;

    try {
      const result = await (api.rpc as any)[section][method](...values);

      console.log('submitRpc: result ::', format(result));

      return {
        result,
        status: 'sent'
      };
    } catch (error) {
      console.error(error);

      return {
        error,
        status: 'error'
      };
    }
  }

  private async makeExtrinsicCall (extrinsic: SubmittableExtrinsic, id: number, extrinsicCall: (...params: Array<any>) => any, ..._params: Array<any>): Promise<void> {
    const { queueSetTxStatus } = this.props;

    try {
      const unsubscribe = await extrinsicCall.apply(extrinsic, [..._params, async (result: SubmittableSendResult) => {
        if (!result || !result.type || !result.status) {
          return;
        }

        const status = result.type.toLowerCase() as QueueTx$Status;

        console.log('submitAndWatchExtrinsic: updated status ::', result);

        queueSetTxStatus(id, status, result);

        if (status === 'finalised') {
          unsubscribe();
        }
      }]);
    } catch (error) {
      console.error('error.message', error.message);
      queueSetTxStatus(id, 'error', {}, error);
    }
  }
}

export {
  Signer
};

export default withMulti(
  Signer,
  translate,
  withApi
);
