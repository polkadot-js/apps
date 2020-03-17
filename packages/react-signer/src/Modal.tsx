// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SignerOptions, SignerResult, Signer as ApiSigner } from '@polkadot/api/types';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import { ApiProps } from '@polkadot/react-api/types';
import { I18nProps, BareProps } from '@polkadot/react-components/types';
import { RpcMethod } from '@polkadot/jsonrpc/types';
import { KeyringPair } from '@polkadot/keyring/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import {
  QueueTx,
  QueueTxMessageSetStatus,
  QueueTxResult,
  QueueTxStatus
} from '@polkadot/react-components/Status/types';
import { SignerPayloadJSON } from '@polkadot/types/types';

import BN from 'bn.js';
import React from 'react';
import { SubmittableResult } from '@polkadot/api';
import { web3FromSource } from '@polkadot/extension-dapp';
import { createType } from '@polkadot/types';
import { Button, InputBalance, Modal, Toggle, Output, ErrorBoundary, InputNumber } from '@polkadot/react-components';
import { registry } from '@polkadot/react-api';
import { withApi, withMulti, withObservable } from '@polkadot/react-api/hoc';
import keyring from '@polkadot/ui-keyring';
import { assert, isFunction } from '@polkadot/util';
import { format } from '@polkadot/util/logger';

import ledgerSigner from './LedgerSigner';
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
  accountNonce?: string;
  blocks: string;
  currentItem?: QueueTx;
  isQrScanning: boolean;
  isQrVisible: boolean;
  isRenderError: boolean;
  isSendable: boolean;
  isSubmit: boolean;
  isV2?: boolean;
  nonce?: string;
  password: string;
  qrAddress: string;
  qrPayload: Uint8Array;
  qrResolve?: (result: SignerResult) => void;
  qrReject?: (error: Error) => void;
  showTip: boolean;
  signedTx?: string;
  tip?: BN;
  unlockError?: string | null;
}

let qrId = 0;

function extractExternal (
  accountId?: string | null
): { isExternal: boolean; isHardware: boolean; hardwareType?: string } {
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
async function makeExtrinsicSignature (
  payload: SignerPayloadJSON,
  { id, signerCb }: QueueTx,
  pair: KeyringPair
): Promise<void> {
  console.log('makeExtrinsicSignature: payload ::', JSON.stringify(payload));

  const result = createType(registry, 'ExtrinsicPayload', payload, { version: payload.version }).sign(pair);

  if (isFunction(signerCb)) {
    signerCb(id, { id, ...result });
  }
}

const initialState: State = {
  accountNonce: undefined,
  blocks: '50',
  isQrScanning: false,
  isQrVisible: false,
  isRenderError: false,
  isSendable: false,
  isSubmit: true,
  nonce: undefined,
  password: '',
  qrAddress: '',
  qrPayload: new Uint8Array(),
  showTip: false,
  signedTx: '',
  unlockError: null
};

class Signer extends React.PureComponent<Props, State> {
  public state: State = initialState;

  public static getDerivedStateFromProps (
    { allAccounts, api, queue }: Props,
    { currentItem, password, unlockError }: State
  ): Partial<State> {
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
      ((!nextItem.accountId && !currentItem.accountId) ||
        (nextItem.accountId && nextItem.accountId.toString()) ===
          (currentItem.accountId && currentItem.accountId.toString()));

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
    const { accountNonce, currentItem, isSubmit } = this.state;

    if (currentItem && currentItem.status === 'queued' && !(currentItem.extrinsic || currentItem.payload)) {
      return this.sendRpc(currentItem);
    }

    if (!isSubmit && currentItem?.accountId && accountNonce == null) {
      this.updateNonce();
    }
  }

  public render (): React.ReactNode {
    const { className, t } = this.props;
    const { currentItem } = this.state;

    if (!currentItem) {
      return null;
    }

    return (
      <Modal
        className={`ui--signer-Signer ${className}`}
        header={t('Authorize transaction')}
      >
        <ErrorBoundary onError={this.onRenderError}>{this.renderContent()}</ErrorBoundary>
        {this.renderButtons()}
      </Modal>
    );
  }

  private renderButtons (): React.ReactNode {
    const { t } = this.props;
    const { currentItem, isQrScanning, isQrVisible, isRenderError, isSendable, isSubmit, signedTx } = this.state;

    if (!currentItem) {
      return null;
    }

    const { isExternal, isHardware, hardwareType } = extractExternal(currentItem.accountId);

    return (
      <Modal.Actions cancelLabel={signedTx ? t('Close') : undefined} withOr={!signedTx} onCancel={isQrVisible ? this.onCancelQr : signedTx ? this.onCancelSign : this.onCancel}>
        {!isRenderError && (!isQrVisible || !isQrScanning) && !signedTx && (
          <>
            {!currentItem.isUnsigned && this.renderSignToggle()}
            <Button.Or />
            <Button
              className='ui--signer-Signer-Submit'
              isDisabled={!isSendable}
              isPrimary
              onClick={isQrVisible ? this.activateQrScanning : this.onSend}
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
                        : isSubmit
                          ? t('Sign and Submit')
                          : t('Sign (no submission)')
              }
              icon={isQrVisible ? 'qrcode' : currentItem.isUnsigned ? 'sign-in' : isExternal ? 'qrcode' : 'sign-in'}
            />
          </>
        )}
      </Modal.Actions>
    );
  }

  private renderContent (): React.ReactNode {
    const { currentItem, isQrScanning, isQrVisible, isSendable, isSubmit, qrAddress, qrPayload, tip } = this.state;

    if (!currentItem) {
      return null;
    }

    return (
      <Transaction
        hideDetails={isQrVisible}
        isSendable={isSendable}
        onError={this.onRenderError}
        tip={tip}
        value={currentItem}
      >
        {isQrVisible ? (
          <Qr address={qrAddress} isScanning={isQrScanning} onSignature={this.addQrSignature} payload={qrPayload} />
        ) : (
          <>
            {this.renderTip()}
            {this.renderUnlock()}
            {!isSubmit && this.renderSignFields()}
          </>
        )}
      </Transaction>
    );
  }

  private renderTip (): React.ReactNode {
    const { t } = this.props;
    const { currentItem, isSendable, isV2, showTip, signedTx } = this.state;

    if (!isV2 || !isSendable || !currentItem || currentItem.isUnsigned) {
      return null;
    }

    return (
      <>
        <Toggle
          className='tipToggle'
          label={
            showTip
              ? t('Include an optional tip for faster processing')
              : t('Do not include a tip for the block author')
          }
          isDisabled={!!signedTx}
          onChange={this.onShowTip}
          value={showTip}
        />
        {showTip && (
          <InputBalance
            defaultValue={new BN(0)}
            help={t('Add a tip to this extrinsic, paying the block author for greater priority')}
            isZeroable
            isDisabled={!!signedTx}
            onChange={this.onChangeTip}
            label={t('Tip (optional)')}
          />
        )}
      </>
    );
  }

  private renderSignToggle (): React.ReactNode {
    const { t } = this.props;
    const { isSubmit, isQrVisible, isQrScanning } = this.state;

    return <Toggle
      className='signToggle'
      label={
        isSubmit
          ? t('Sign and Submit')
          : t('Sign (no submission)')
      }
      isDisabled={isQrVisible || isQrScanning}
      onChange={this.onToggleSign}
      value={isSubmit}
    />;
  }

  private renderSignFields (): React.ReactNode {
    const { t } = this.props;
    const { accountNonce, blocks, isSubmit, signedTx } = this.state;

    if (isSubmit || accountNonce == null) {
      return null;
    }

    return (
      <>
        <br />
        <InputNumber isZeroable={true} label={t('Nonce')} labelExtra={t('Current account nonce: {{accountNonce}}', { replace: { accountNonce } })} isDisabled={!!signedTx} value={accountNonce} onChange={this.onChangeNonce} />
        <InputNumber isZeroable={true} label={t('Lifetime (# of blocks)')} labelExtra={t('Set to 0 to make transaction immortal')} isDisabled={!!signedTx} value={blocks} onChange={this.onChangeBlocks} />
        {!!signedTx && <Output
          label={t('Signed transaction')}
          value={signedTx}
          withCopy
        />}
      </>
    );
  }

  private onRenderError = (): void => {
    this.setState({ isRenderError: true });
  };

  private onShowTip = (showTip: boolean): void => {
    this.setState({ showTip });
  };

  private onToggleSign = (isSubmit: boolean): void => {
    this.setState({ isSubmit });
  }

  private onChangeNonce = (value?: BN): void => {
    this.setState({ nonce: value ? value.toString() : '0' });
  }

  private onChangeBlocks = (value?: BN): void => {
    this.setState({ blocks: value ? value.toString() : '0' });
  }

  private renderUnlock (): React.ReactNode {
    const { currentItem, isSendable, password, unlockError } = this.state;

    const { isExternal } = currentItem ? extractExternal(currentItem.accountId) : { isExternal: false };

    if (!isSendable || !currentItem || currentItem.isUnsigned || isExternal) {
      return null;
    }

    return (
      <Unlock
        autoFocus
        error={unlockError || undefined}
        onChange={this.onChangePassword}
        onEnter={this.onSend}
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
  };

  private onChangeTip = (tip?: BN): void => {
    this.setState({ tip });
  };

  private onCancelQr = (): void => {
    this.setState(
      {
        isQrScanning: false,
        isQrVisible: false
      },
      (): void => {
        const { qrReject } = this.state;

        qrReject && qrReject(new Error('cancelled'));

        this.onCancel();
      }
    );
  };

  private onCancelSign = (): void => {
    const { queueSetTxStatus } = this.props;
    const { currentItem } = this.state;
    const { id, txSuccessCb } = currentItem as QueueTx;
    queueSetTxStatus(id, 'completed');

    if (isFunction(txSuccessCb)) {
      txSuccessCb({} as any);
    }

    this.setState(initialState);
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

    this.setState(initialState);
  };

  private onSend = async (): Promise<void> => {
    const { currentItem, password } = this.state;

    // This should never be executed
    if (!currentItem) {
      return;
    }

    return this.sendExtrinsic(currentItem, password);
  };

  private updateNonce = async (): Promise<void> => {
    const { currentItem } = this.state;
    let accountNonce: string | undefined;
    if (currentItem?.accountId) {
      accountNonce = (await this.props.api.rpc.account.nextIndex(currentItem.accountId)).toString();
    } else {
      accountNonce = undefined;
    }

    this.setState({ accountNonce, nonce: accountNonce });
  };

  private signQrPayload = (payload: SignerPayloadJSON): Promise<SignerResult> => {
    return new Promise((resolve, reject): void => {
      this.setState({
        isQrVisible: true,
        qrAddress: payload.address,
        qrPayload: createType(registry, 'ExtrinsicPayload', payload, { version: payload.version }).toU8a(),
        qrResolve: resolve,
        qrReject: reject
      });
    });
  };

  private addQrSignature = ({ signature }: { signature: string }): void => {
    this.setState(
      ({ qrResolve }: State): Pick<State, never> => {
        qrResolve &&
          qrResolve({
            id: ++qrId,
            signature
          });

        return {
          isQrScanning: false,
          isQrVisible: false
        };
      }
    );
  };

  private activateQrScanning = (): void => {
    this.setState({ isQrScanning: true });
  };

  private sendRpc = async ({ id, rpc, values = [] }: QueueTx): Promise<void> => {
    if (!rpc) {
      return;
    }

    const { queueSetTxStatus } = this.props;

    queueSetTxStatus(id, 'sending');

    const { error, result, status } = await this.submitRpc(rpc, values);

    queueSetTxStatus(id, status, result, error);
  };

  private async sendExtrinsic (queueTx: QueueTx, password?: string): Promise<void> {
    const { queueSetTxStatus } = this.props;
    const { isV2, isSubmit, showTip, tip } = this.state;

    const { accountId, extrinsic, id, payload, isUnsigned } = queueTx;

    if (!isUnsigned) {
      assert(accountId, 'Expected an accountId with signed transactions');

      const unlockError = this.unlockAccount(accountId, password);

      if (unlockError) {
        this.setState({ unlockError });
        return;
      }
    }

    if (payload) {
      queueSetTxStatus(id, 'completed');

      return makeExtrinsicSignature(
        {
          ...payload,
          ...(isV2 && showTip && tip && !payload.tip ? { tip: tip.toString() } : {})
        },
        queueTx,
        keyring.getPair(accountId as string)
      );
    }

    const submittable = extrinsic as SubmittableExtrinsic;

    assert(submittable, 'Expected an extrinsic to be supplied to sendExtrinsic');

    return isUnsigned
      ? this.makeExtrinsicCall(submittable, queueTx, submittable.send.bind(submittable))
      : isSubmit
        ? this.makeExtrinsicCall(submittable, queueTx, submittable.signAndSend.bind(submittable), keyring.getPair(accountId as string))
        : this.makeSignedTransaction(submittable, queueTx, keyring.getPair(accountId as string));
  }

  private async submitRpc ({ method, section }: RpcMethod, values: any[]): Promise<QueueTxResult> {
    const { api } = this.props;

    try {
      assert(
        isFunction((api.rpc as any)[section] && (api.rpc as any)[section][method]),
        `api.rpc.${section}.${method} does not exist`
      );

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

  private async makeExtrinsicCall (
    extrinsic: SubmittableExtrinsic,
    { id, txFailedCb, txSuccessCb, txStartCb, txUpdateCb }: QueueTx,
    extrinsicCall: (...params: any[]) => any,
    pair?: KeyringPair
  ): Promise<void> {
    const { api, queueSetTxStatus } = this.props;
    const { isV2, showTip, tip } = this.state;

    console.log('makeExtrinsicCall: extrinsic ::', extrinsic.toHex());

    const params = [];

    if (pair) {
      const {
        address,
        meta: { isExternal, isHardware, isInjected, source }
      } = pair;

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
        params.push(pair, { genesisHash: '0x00' });
      }
    }

    if (showTip && isV2 && tip) {
      params.push({ tip } as Partial<SignerOptions>);
    }

    if (isFunction(txStartCb)) {
      txStartCb();
    }

    try {
      const unsubscribe = await extrinsicCall.apply(extrinsic, [
        ...params,
        // eslint-disable-next-line @typescript-eslint/require-await
        async (result: SubmittableResult): Promise<void> => {
          if (!result || !result.status) {
            return;
          }

          const status = result.status.type.toLowerCase() as QueueTxStatus;

          console.log('makeExtrinsicCall: updated status ::', JSON.stringify(result));
          queueSetTxStatus(id, status, result);

          if (isFunction(txUpdateCb)) {
            txUpdateCb(result);
          }

          if (result.status.isFinalized || result.status.isInBlock) {
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
        }
      ]);

      queueSetTxStatus(id, 'sending');
    } catch (error) {
      console.error('makeExtrinsicCall: error:', error);
      queueSetTxStatus(id, 'error', {}, error);

      if (isFunction(txFailedCb)) {
        txFailedCb(null);
      }
    }
  }

  private async makeSignedTransaction (
    extrinsic: SubmittableExtrinsic,
    { id, txFailedCb, txStartCb }: QueueTx,
    pair: KeyringPair
  ): Promise<void> {
    const { queueSetTxStatus } = this.props;
    const { isV2, blocks, nonce, showTip, tip } = this.state;

    console.log('makeSignedTransaction: extrinsic ::', extrinsic.toHex());

    const {
      address,
      meta: { isExternal, isHardware, isInjected, source }
    } = pair;
    let signer: ApiSigner | undefined;

    if (isFunction(txStartCb)) {
      txStartCb();
    }

    // set the signer
    if (isHardware) {
      signer = ledgerSigner;
    } else if (isExternal) {
      queueSetTxStatus(id, 'qr');
      signer = { signPayload: this.signQrPayload };
    } else if (isInjected) {
      const injected = await web3FromSource(source);
      signer = injected?.signer;
    }

    assert(signer || pair, `Unable to find a signer for ${address}`);

    try {
      await extrinsic.signAsync((signer ? address : pair) as any, {
        era: +blocks as any,
        nonce: +(nonce || 0),
        signer,
        tip: (showTip && isV2 && tip) ? tip : undefined
      });
      const signedTx = extrinsic.toJSON()?.toString();

      console.log('makeSignedTransaction: result ::', signedTx);

      this.setState({ signedTx });
    } catch (e) {
      queueSetTxStatus(id, 'error', undefined, e);
      if (isFunction(txFailedCb)) {
        txFailedCb(e);
      }
    }
  }
}

export { Signer };

export default withMulti(
  Signer,
  translate,
  withApi,
  withObservable(keyring.accounts.subject, { propName: 'allAccounts' })
);
