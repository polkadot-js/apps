// Copyright 2017-2019 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SignerOptions, SignerResult } from '@polkadot/api/types';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { ApiProps } from '@polkadot/react-api/types';
import { I18nProps, BareProps } from '@polkadot/react-components/types';
import { RpcMethod } from '@polkadot/jsonrpc/types';
import { KeyringPair } from '@polkadot/keyring/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { QueueTx, QueueTxMessageSetStatus, QueueTxResult, QueueTxStatus } from '@polkadot/react-components/Status/types';
import { SignerPayloadJSON } from '@polkadot/types/types';

import BN from 'bn.js';
import React from 'react';
import { SubmittableResult } from '@polkadot/api';
import { web3FromSource } from '@polkadot/extension-dapp';
import { createType } from '@polkadot/types';
import { Button, InputBalance, Modal, Toggle } from '@polkadot/react-components';
import { withApi, withMulti, withObservable } from '@polkadot/react-api';
import keyring from '@polkadot/ui-keyring';
import { assert, isFunction } from '@polkadot/util';
import { format } from '@polkadot/util/logger';

import ledgerSigner from './LedgerSigner';
import PasswordCheck from './PasswordCheck';
import Transaction from './Transaction';
import Qr from './Qr';
import Unlock from './Unlock';
import translate from './translate';

interface BaseProps extends BareProps {
  queue: QueueTx[];
  queueSetTxStatus: QueueTxMessageSetStatus;
}

interface Props extends I18nProps, ApiProps, BaseProps {
  allAccounts?: SubjectInfo;
}

interface State {
  currentItem?: QueueTx;
  isQrScanning: boolean;
  isQrVisible: boolean;
  isSendable: boolean;
  isV2?: boolean;
  password: string;
  qrAddress: string;
  qrPayload: Uint8Array;
  qrResolve?: (result: SignerResult) => void;
  qrReject?: (error: Error) => void;
  showTip: boolean;
  tip?: BN;
  unlockError?: string | null;
}

let qrId = 0;

function extractExternal (accountId?: string | null): { isExternal: boolean; isHardware: boolean; hardwareType?: string } {
  if (!accountId) {
    return { isExternal: false, isHardware: false };
  }

  let publicKey;

  try {
    publicKey = keyring.decodeAddress(accountId);
  } catch (error) {
    console.error(error);

    return { isExternal: false, isHardware: false };
  }

  const pair = keyring.getPair(publicKey);

  return {
    isExternal: !!pair.meta.isExternal,
    isHardware: !!pair.meta.isHardware,
    hardwareType: pair.meta.hardwareType
  };
}

// eslint-disable-next-line @typescript-eslint/require-await
async function makeExtrinsicSignature (payload: SignerPayloadJSON, { id, signerCb }: QueueTx, pair: KeyringPair): Promise<void> {
  console.log('makeExtrinsicSignature: payload ::', JSON.stringify(payload));

  const result = createType('ExtrinsicPayload', payload, { version: payload.version }).sign(pair);

  if (isFunction(signerCb)) {
    signerCb(id, { id, ...result });
  }
}

class Signer extends React.PureComponent<Props, State> {
  public state: State = {
    isSendable: false,
    isQrScanning: false,
    isQrVisible: false,
    password: '',
    qrAddress: '',
    qrPayload: new Uint8Array(),
    showTip: false,
    unlockError: null
  };

  public static getDerivedStateFromProps ({ allAccounts, api, queue }: Props, { currentItem, password, unlockError }: State): Partial<State> {
    let isV2: boolean;
    try {
      isV2 = !!api.tx.session.setKeys;
    } catch (e) {
      isV2 = false;
    }

    const nextItem = queue.find(({ status }): boolean => ['queued', 'qr'].includes(status));
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
    const { currentItem, isQrScanning, isQrVisible, isSendable } = this.state;

    if (!currentItem) {
      return null;
    }

    const { isExternal, isHardware, hardwareType } = extractExternal(currentItem.accountId);

    return (
      <Modal.Actions>
        <Button.Group>
          <Button
            isNegative
            onClick={
              isQrVisible
                ? this.onCancelQr
                : this.onCancel
            }
            tabIndex={3}
            label={t('Cancel')}
            icon='cancel'
          />
          {(!isQrVisible || !isQrScanning) && (
            <>
              <Button.Or />
              <Button
                className='ui--signer-Signer-Submit'
                isDisabled={!isSendable}
                isPrimary
                onClick={
                  isQrVisible
                    ? this.activateQrScanning
                    : this.onSend
                }
                tabIndex={2}
                label={
                  isQrVisible
                    ? t('Scan Signature Qr')
                    : currentItem.isUnsigned
                      ? t('Submit (no signature)')
                      : isHardware
                        ? t('Sign via {{hardwareType}}', { replace: { hardwareType: hardwareType || 'hardware' } })
                        : isExternal
                          ? t('Sign via Qr')
                          : t('Sign and Submit')
                }
                icon={
                  isQrVisible
                    ? 'qrcode'
                    : currentItem.isUnsigned
                      ? 'sign-in'
                      : isExternal
                        ? 'qrcode'
                        : 'sign-in'
                }
              />
            </>
          )}
        </Button.Group>
      </Modal.Actions>
    );
  }

  private renderContent (): React.ReactNode {
    const { currentItem, isQrScanning, isQrVisible, isSendable, qrAddress, qrPayload, tip } = this.state;

    if (!currentItem) {
      return null;
    }

    return (
      <Transaction
        hideDetails={isQrVisible}
        isSendable={isSendable}
        tip={tip}
        value={currentItem}
      >
        {
          isQrVisible
            ? (
              <Qr
                address={qrAddress}
                isScanning={isQrScanning}
                onSignature={this.addQrSignature}
                payload={qrPayload}
              />
            )
            : (
              <>
                {this.renderTip()}
                {this.renderUnlock()}
              </>
            )
        }
      </Transaction>
    );
  }

  private renderTip (): React.ReactNode {
    const { t } = this.props;
    const { currentItem, isSendable, isV2, showTip } = this.state;

    if (!isV2 || !isSendable || !currentItem || currentItem.isUnsigned) {
      return null;
    }

    return (
      <>
        <Toggle
          label={
            showTip
              ? t('Include an optional tip for faster processing')
              : t('Do not include a tip for the block author')
          }
          onChange={this.onShowTip}
          value={showTip}
        />
        {showTip && (
          <InputBalance
            defaultValue={new BN(0)}
            help={t('Add a tip to this extrinsic, paying the block author for greater priority')}
            onChange={this.onChangeTip}
            label={t('Tip (optional)')}
          />
        )}
      </>
    );
  }

  private onShowTip = (showTip: boolean): void => {
    this.setState({ showTip });
  }

  private renderUnlock (): React.ReactNode {
    const { currentItem, isSendable, password, unlockError } = this.state;

    const { isExternal } = currentItem
      ? extractExternal(currentItem.accountId)
      : { isExternal: false };

    if (!isSendable || !currentItem || currentItem.isUnsigned || isExternal) {
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

    if (!pair.isLocked || pair.meta.isInjected || pair.meta.isExternal) {
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

  private onCancelQr = (): void => {
    this.setState({
      isQrScanning: false,
      isQrVisible: false
    }, (): void => {
      const { qrReject } = this.state;

      qrReject && qrReject(new Error('cancelled'));

      this.onCancel();
    });
  };

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

  private signQrPayload = (payload: SignerPayloadJSON): Promise<SignerResult> => {
    return new Promise((resolve, reject): void => {
      this.setState({
        isQrVisible: true,
        qrAddress: payload.address,
        qrPayload: createType('ExtrinsicPayload', payload, { version: payload.version }).toU8a(),
        qrResolve: resolve,
        qrReject: reject
      });
    });
  }

  private addQrSignature = ({ signature }: { signature: string }): void => {
    this.setState(({ qrResolve }: State): Pick<State, never> => {
      qrResolve && qrResolve({
        id: ++qrId,
        signature
      });

      return {
        isQrScanning: false,
        isQrVisible: false
      };
    });
  }

  private activateQrScanning = (): void => {
    this.setState({ isQrScanning: true });
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
    const { isV2, showTip, tip } = this.state;

    const { accountId, extrinsic, payload, isUnsigned } = queueTx;

    if (!isUnsigned) {
      assert(accountId, 'Expected an accountId with signed transactions');

      const unlockError = this.unlockAccount(accountId, password);

      if (unlockError) {
        this.setState({ unlockError });
        return;
      }
    }

    if (payload) {
      return makeExtrinsicSignature(
        {
          ...payload,
          ...((isV2 && showTip && tip && !payload.tip) ? { tip: tip.toString() } : {})
        },
        queueTx,
        keyring.getPair(accountId as string)
      );
    }

    const submittable = extrinsic as SubmittableExtrinsic;

    assert(submittable, 'Expected an extrinsic to be supplied to sendExtrinsic');

    return isUnsigned
      // eslint-disable-next-line @typescript-eslint/unbound-method
      ? this.makeExtrinsicCall(submittable, queueTx, submittable.send)
      // eslint-disable-next-line @typescript-eslint/unbound-method
      : this.makeExtrinsicCall(submittable, queueTx, submittable.signAndSend, keyring.getPair(accountId as string));
  }

  private async submitRpc ({ method, section }: RpcMethod, values: any[]): Promise<QueueTxResult> {
    const { api } = this.props;

    try {
      assert(isFunction((api.rpc as any)[section] && (api.rpc as any)[section][method]), `api.rpc.${section}.${method} does not exist`);

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
    const { isV2, showTip, tip } = this.state;

    console.log('makeExtrinsicCall: extrinsic ::', extrinsic.toHex());

    const params = [];

    if (pair) {
      const { address, meta: { isExternal, isHardware, isInjected, source } } = pair;

      queueSetTxStatus(id, 'signing');

      // set the signer
      if (isHardware) {
        api.setSigner(ledgerSigner);
        params.push(address);
      } else if (isExternal) {
        queueSetTxStatus(id, 'qr');
        api.setSigner({ signPayload: this.signQrPayload });
        params.push(address);
      } else if (isInjected) {
        const injected = await web3FromSource(source);

        assert(injected, `Unable to find a signer for ${address}`);

        api.setSigner(injected.signer);
        params.push(address);
      } else {
        params.push(pair);
      }
    }

    if (showTip && isV2 && tip) {
      params.push({ tip } as Partial<SignerOptions>);
    }

    if (isFunction(txStartCb)) {
      txStartCb();
    }

    try {
      // eslint-disable-next-line @typescript-eslint/require-await
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

      queueSetTxStatus(id, 'sending');
    } catch (error) {
      console.error('makeExtrinsicCall: error:', error);
      queueSetTxStatus(id, 'error', {}, error);

      if (isFunction(txFailedCb)) {
        txFailedCb(null);
      }
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
