// Copyright 2017-2019 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableResult } from '@polkadot/api/SubmittableExtrinsic';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { I18nProps, BareProps } from '@polkadot/ui-app/types';
import { RpcMethod } from '@polkadot/jsonrpc/types';
import { KeyringPair } from '@polkadot/keyring/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { QueueTx, QueueTx$MessageSetStatus, QueueTx$Result, QueueTx$Status } from '@polkadot/ui-app/Status/types';

import React from 'react';
import { Button, Modal } from '@polkadot/ui-app';
import keyring from '@polkadot/ui-keyring';
import { withApi, withMulti, withObservable } from '@polkadot/ui-api';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import { assert, isFunction } from '@polkadot/util';
import { format } from '@polkadot/util/logger';

import Transaction from './Transaction';
import Unlock from './Unlock';
import translate from './translate';

type BaseProps = BareProps & {
  queue: Array<QueueTx>,
  queueSetTxStatus: QueueTx$MessageSetStatus
};

type Props = I18nProps & ApiProps & BaseProps & {
  allAccounts?: SubjectInfo
};

type State = {
  currentItem?: QueueTx,
  isSendable: boolean,
  password: string,
  unlockError?: string | null
};

class Signer extends React.PureComponent<Props, State> {
  state: State = {
    isSendable: false,
    password: '',
    unlockError: null
  };

  static getDerivedStateFromProps ({ allAccounts, queue }: Props, { currentItem, password, unlockError }: State): State {
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

    let isSendable = !!nextItem && !!nextItem.isUnsigned;

    if (!isSendable && nextItem && nextItem.accountId && allAccounts) {
      try {
        const pair = keyring.getPair(nextItem.accountId);

        isSendable = !!pair && !!allAccounts[nextItem.accountId];
      } catch (error) {
        // swallow
      }
    }

    return {
      currentItem: nextItem,
      isSendable,
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
    const { currentItem, isSendable } = this.state;

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
            label={t('Cancel')}
          />
          <Button.Or />
          <Button
            className='ui--signer-Signer-Submit'
            isDisabled={!isSendable}
            isPrimary
            onClick={this.onSend}
            tabIndex={2}
            label={
              currentItem.isUnsigned
                ? t('Submit (no signature)')
                : t('Sign and Submit')
            }
          />
        </Button.Group>
      </Modal.Actions>
    );
  }

  private renderContent () {
    const { currentItem, isSendable } = this.state;

    if (!currentItem) {
      return null;
    }

    return (
      <Transaction
        isSendable={isSendable}
        value={currentItem}
      >
        {this.renderUnlock()}
      </Transaction>
    );
  }

  private renderUnlock () {
    const { currentItem, isSendable, password, unlockError } = this.state;

    if (!isSendable || !currentItem || currentItem.isUnsigned) {
      return null;
    }

    return (
      <Unlock
        autoFocus
        error={unlockError || undefined}
        onChange={this.onChangePassword}
        onKeyDown={this.onKeyDown}
        password={password}
        value={currentItem.accountId}
        tabIndex={1}
      />
    );
  }

  private unlockAccount (accountId: string, password?: string): string | null {
    let publicKey;

    try {
      publicKey = keyring.decodeAddress(accountId);
    } catch (error) {
      console.error(error);

      return 'unable to decode address';
    }

    const pair = keyring.getPair(publicKey);

    if (!pair.isLocked()) {
      return null;
    }

    try {
      pair.decodePkcs8(password);
    } catch (error) {
      console.error(error);

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

    const { id, signerCb } = currentItem;

    queueSetTxStatus(id, 'cancelled');

    if (isFunction(signerCb)) {
      signerCb(id, false);
    }
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

  private async sendExtrinsic (queueTx: QueueTx, password?: string): Promise<void> {
    const { accountId, extrinsic, id, signerOptions, isUnsigned } = queueTx;

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

    if (isUnsigned) {
      return this.makeExtrinsicCall(submittable, queueTx, submittable.send);
    } else if (signerOptions) {
      return this.makeExtrinsicSignature(submittable, queueTx, keyring.getPair(accountId as string));
    }

    return this.makeExtrinsicCall(submittable, queueTx, submittable.signAndSend, keyring.getPair(accountId as string));
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

  private async makeExtrinsicCall (extrinsic: SubmittableExtrinsic, { id, txFailedCb, txSuccessCb, txUpdateCb }: QueueTx, extrinsicCall: (...params: Array<any>) => any, ..._params: Array<any>): Promise<void> {
    const { queueSetTxStatus } = this.props;

    console.log('makeExtrinsicCall: extrinsic ::', extrinsic.toHex());

    try {
      const unsubscribe = await extrinsicCall.apply(extrinsic, [..._params, async (result: SubmittableResult) => {
        if (!result || !result.type || !result.status) {
          return;
        }

        const status = result.type.toLowerCase() as QueueTx$Status;

        console.log('makeExtrinsicCall: updated status ::', result);

        queueSetTxStatus(id, status, result);

        if (isFunction(txUpdateCb)) {
          txUpdateCb(result);
        }

        if (status === 'finalised') {
          unsubscribe();

          result.events
            .filter(({ event: { section } }) => section === 'system')
            .forEach(({ event: { method } }) => {
              if (isFunction(txFailedCb) && method === 'ExtrinsicFailed') {
                txFailedCb(result);
              } else if (isFunction(txSuccessCb) && method === 'ExtrinsicSuccess') {
                txSuccessCb(result);
              }
            });
        }
      }]);
    } catch (error) {
      console.error('makeExtrinsicCall: error:', error.message);
      queueSetTxStatus(id, 'error', {}, error);
    }
  }

  private async makeExtrinsicSignature (extrinsic: SubmittableExtrinsic, { id, signerCb, signerOptions }: QueueTx, pair: KeyringPair): Promise<void> {
    console.log('makeExtrinsicSignature: extrinsic ::', extrinsic.toHex());

    extrinsic.sign(pair, signerOptions || {});

    if (isFunction(signerCb)) {
      signerCb(id, true);
    }
  }
}

export {
  Signer
};

export default withMulti(
  Signer,
  translate,
  withApi,
  withObservable(accountObservable.subject, { propName: 'allAccounts' })
);
