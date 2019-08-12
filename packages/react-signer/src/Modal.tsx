// Copyright 2017-2019 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableResult } from '@polkadot/api/SubmittableExtrinsic';
import { SignerOptions, SignerPayload } from '@polkadot/api/types';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { ApiProps } from '@polkadot/react-api/types';
import { I18nProps, BareProps } from '@polkadot/react-components/types';
import { RpcMethod } from '@polkadot/jsonrpc/types';
import { KeyringPair } from '@polkadot/keyring/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { QueueTx, QueueTxMessageSetStatus, QueueTxResult, QueueTxStatus } from '@polkadot/react-components/Status/types';

import BN from 'bn.js';
import React from 'react';
import { web3FromSource } from '@polkadot/extension-dapp';
import { createType } from '@polkadot/types';
import { Button, InputBalance, Modal } from '@polkadot/react-components';
import { withApi, withMulti, withObservable } from '@polkadot/react-api';
import keyring from '@polkadot/ui-keyring';
import { assert, isFunction } from '@polkadot/util';
import { format } from '@polkadot/util/logger';

import PasswordCheck from './PasswordCheck';
import Transaction from './Transaction';
import translate from './translate';
import Unlock from './Unlock';

interface BaseProps extends BareProps {
  queue: QueueTx[];
  queueSetTxStatus: QueueTxMessageSetStatus;
}

type Props = I18nProps & ApiProps & BaseProps & {
  allAccounts?: SubjectInfo;
};

interface State {
  currentItem?: QueueTx;
  isSendable: boolean;
  isV2?: boolean;
  password: string;
  tip?: BN;
  unlockError?: string | null;
}

class Signer extends React.PureComponent<Props, State> {
  public state: State = {
    isSendable: false,
    password: '',
    unlockError: null
  };

  public static getDerivedStateFromProps ({ allAccounts, api, queue }: Props, { currentItem, password, unlockError }: State): State {
    let isV2: boolean;
    try {
      isV2 = !!api.tx.session.setKeys;
    } catch (e) {
      isV2 = false;
    }

    const nextItem = queue.find(({ status }): boolean => status === 'queued');
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
      isV2,
      password: isSame ? password : '',
      unlockError: isSame ? unlockError : null
    };
  }

  public async componentDidUpdate (): Promise<void> {
    const { currentItem } = this.state;

    if (currentItem && currentItem.status === 'queued' && !(currentItem.extrinsic || currentItem.payload)) {
      return this.sendRpc(currentItem);
    }
  }

  public render (): React.ReactNode {
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

  private renderButtons (): React.ReactNode {
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

  private renderContent (): React.ReactNode {
    const { currentItem, isSendable } = this.state;

    if (!currentItem) {
      return null;
    }

    return (
      <Transaction
        isSendable={isSendable}
        value={currentItem}
      >
        {this.renderTip()}
        {this.renderUnlock()}
      </Transaction>
    );
  }

  private renderTip (): React.ReactNode {
    const { t } = this.props;
    const { currentItem, isSendable, isV2 } = this.state;

    if (!isV2 || !isSendable || !currentItem) {
      return null;
    }

    return (
      <InputBalance
        defaultValue={new BN(0)}
        help={t('Add a tip to this extrinsic, paying the block author for greater priority')}
        onChange={this.onChangeTip}
        label={t('Tip (optional)')}
      />
    );
  }

  private renderUnlock (): React.ReactNode {
    const { currentItem, isSendable, password, unlockError } = this.state;

    if (!isSendable || !currentItem || currentItem.isUnsigned) {
      return null;
    }

    return (
      <>
        <Unlock
          autoFocus
          error={unlockError || undefined}
          onChange={this.onChangePassword}
          password={password}
          value={currentItem.accountId}
          tabIndex={1}
        />
        <PasswordCheck
          unlockError={unlockError}
        />
      </>
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

    if (!pair.isLocked || pair.meta.isInjected) {
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

  private onChangeTip = (tip?: BN): void => {
    this.setState({ tip });
  }

  private onCancel = (): void => {
    const { queueSetTxStatus } = this.props;
    const { currentItem } = this.state;

    // This should never be executed
    if (!currentItem) {
      return;
    }

    const { id, signerCb, txFailedCb } = currentItem;

    queueSetTxStatus(id, 'cancelled');

    if (isFunction(signerCb)) {
      signerCb(id, null);
    }

    if (isFunction(txFailedCb)) {
      txFailedCb(null);
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
    const { isV2, tip } = this.state;

    const { accountId, extrinsic, id, payload, isUnsigned } = queueTx;

    if (!isUnsigned) {
      assert(accountId, 'Expected an accountId with signed transactions');

      const unlockError = this.unlockAccount(accountId as string, password);

      if (unlockError) {
        this.setState({ unlockError });
        return;
      }
    }

    const { queueSetTxStatus } = this.props;

    if (payload) {
      return this.makeExtrinsicSignature(
        {
          ...payload,
          ...((isV2 && tip && !payload.tip) ? { tip: tip.toString() } : {})
        },
        queueTx,
        keyring.getPair(accountId as string)
      );
    }

    const submittable = extrinsic as SubmittableExtrinsic;

    assert(submittable, 'Expected an extrinsic to be supplied to sendExtrinsic');
    queueSetTxStatus(id, 'sending');

    return isUnsigned
      ? this.makeExtrinsicCall(submittable, queueTx, submittable.send)
      : this.makeExtrinsicCall(submittable, queueTx, submittable.signAndSend, keyring.getPair(accountId as string));
  }

  private async submitRpc ({ method, section }: RpcMethod, values: any[]): Promise<QueueTxResult> {
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

  private async makeExtrinsicCall (extrinsic: SubmittableExtrinsic, { id, txFailedCb, txSuccessCb, txStartCb, txUpdateCb }: QueueTx, extrinsicCall: (...params: any[]) => any, pair?: KeyringPair): Promise<void> {
    const { api, queueSetTxStatus } = this.props;
    const { isV2, tip } = this.state;

    console.log('makeExtrinsicCall: extrinsic ::', extrinsic.toHex());

    const params = [];

    if (pair) {
      // set the signer
      if (pair.meta.isInjected) {
        const { address, meta: { source } } = pair;
        const injected = await web3FromSource(source);

        assert(injected, `Unable to find a signer for ${address}`);

        api.setSigner(injected.signer);

        params.push(address);
      } else {
        params.push(pair);
      }
    }

    if (isV2 && tip) {
      const signerOptions: Partial<SignerOptions> = { tip };
      params.push(signerOptions);
    }

    if (isFunction(txStartCb)) {
      txStartCb();
    }

    try {
      const unsubscribe = await extrinsicCall.apply(extrinsic, [...params, async (result: SubmittableResult): Promise<void> => {
        if (!result || !result.status) {
          return;
        }

        const status = result.status.type.toLowerCase() as QueueTxStatus;

        console.log('makeExtrinsicCall: updated status ::', JSON.stringify(result));
        queueSetTxStatus(id, status, result);

        if (isFunction(txUpdateCb)) {
          txUpdateCb(result);
        }

        if (result.status.isFinalized) {
          unsubscribe();

          result.events
            .filter(({ event: { section } }): boolean => section === 'system')
            .forEach(({ event: { method } }): void => {
              if (isFunction(txFailedCb) && method === 'ExtrinsicFailed') {
                txFailedCb(result);
              } else if (isFunction(txSuccessCb) && method === 'ExtrinsicSuccess') {
                txSuccessCb(result);
              }
            });
        } else if (result.isError && isFunction(txFailedCb)) {
          txFailedCb(result);
        }
      }]);
    } catch (error) {
      console.error('makeExtrinsicCall: error:', error);
      queueSetTxStatus(id, 'error', {}, error);

      if (isFunction(txFailedCb)) {
        txFailedCb(null);
      }
    }
  }

  private async makeExtrinsicSignature (payload: SignerPayload, { id, signerCb }: QueueTx, pair: KeyringPair): Promise<void> {
    console.log('makeExtrinsicSignature: payload ::', JSON.stringify(payload));

    const result = createType('ExtrinsicPayload', payload, { version: payload.version }).sign(pair);

    if (isFunction(signerCb)) {
      signerCb(id, { id, ...result });
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
  withObservable(keyring.accounts.subject, { propName: 'allAccounts' })
);
