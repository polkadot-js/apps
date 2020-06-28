// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SignerResult, SubmittableExtrinsic } from '@polkadot/api/types';
import { SignerOptions } from '@polkadot/api/submittable/types';
import { KeyringPair } from '@polkadot/keyring/types';
import { QueueTx, QueueTxMessageSetStatus, QueueTxResult } from '@polkadot/react-components/Status/types';
import { Multisig, Timepoint } from '@polkadot/types/interfaces';
import { AddressProxy } from '@polkadot/react-signer/types';
import { DefinitionRpcExt, SignerPayloadJSON } from '@polkadot/types/types';

import { useCallback, useContext, useEffect, useState } from 'react';
import { ApiPromise } from '@polkadot/api';
import { registry } from '@polkadot/react-api';
import { StatusContext } from '@polkadot/react-components';
import keyring from '@polkadot/ui-keyring';
import { extractExternal, handleTxResults } from '@polkadot/react-signer/util';
import { Option } from '@polkadot/types';
import { BN_ZERO, assert, isFunction } from '@polkadot/util';
import { format } from '@polkadot/util/logger';
import { blake2AsU8a } from '@polkadot/util-crypto';
import useApi from './useApi';
import useToggle from './useToggle';

interface ItemState {
  currentItem: QueueTx | null;
  requestAddress: string | null;
}

interface QrState {
  isQrHashed: boolean;
  isQrVisible: boolean;
  qrAddress: string;
  qrPayload: Uint8Array;
  qrResolve?: (result: SignerResult) => void;
  qrReject?: (error: Error) => void;
}

const NOOP = () => undefined;

async function submitRpc (api: ApiPromise, { method, section }: DefinitionRpcExt, values: any[]): Promise<QueueTxResult> {
  try {
    const rpc = api.rpc as Record<string, Record<string, (...params: unknown[]) => Promise<unknown>>>;

    assert(isFunction(rpc[section] && rpc[section][method]), `api.rpc.${section}.${method} does not exist`);

    const result = await rpc[section][method](...values);

    console.log('submitRpc: result ::', format(result));

    return {
      result,
      status: 'sent'
    };
  } catch (error) {
    console.error(error);

    return {
      error: error as Error,
      status: 'error'
    };
  }
}

async function sendRpc (api: ApiPromise, queueSetTxStatus: QueueTxMessageSetStatus, { id, rpc, values = [] }: QueueTx): Promise<void> {
  if (rpc) {
    queueSetTxStatus(id, 'sending');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { error, result, status } = await submitRpc(api, rpc, values);

    queueSetTxStatus(id, status, result, error);
  }
}

function extractCurrent (api: ApiPromise, queueSetTxStatus: QueueTxMessageSetStatus, txqueue: QueueTx[]): ItemState {
  const nextItem = txqueue.find(({ status }) => ['queued', 'qr'].includes(status)) || null;
  let currentItem = null;

  // when the next up is an RPC, send it immediately
  if (nextItem && nextItem.status === 'queued' && !(nextItem.extrinsic || nextItem.payload)) {
    sendRpc(api, queueSetTxStatus, nextItem).catch(console.error);
  } else {
    currentItem = nextItem;
  }

  return {
    currentItem,
    requestAddress: (currentItem && currentItem.accountId) || null
  };
}

function unlockAccount ({ signAddress, signPassword }: AddressProxy): string | null {
  let publicKey;

  try {
    publicKey = keyring.decodeAddress(signAddress as string);
  } catch (error) {
    console.error(error);

    return 'unable to decode address';
  }

  const pair = keyring.getPair(publicKey);

  try {
    pair.decodePkcs8(signPassword);
  } catch (error) {
    console.error(error);

    return (error as Error).message;
  }

  return null;
}

async function signAndSend (queueSetTxStatus: QueueTxMessageSetStatus, currentItem: QueueTx, tx: SubmittableExtrinsic<'promise'>, pairOrAddress: KeyringPair | string, options: Partial<SignerOptions>): Promise<void> {
  currentItem.txStartCb && currentItem.txStartCb();

  try {
    const unsubscribe = await tx.signAndSend(pairOrAddress, options, handleTxResults('signAndSend', queueSetTxStatus, currentItem, (): void => {
      unsubscribe();
    }));
  } catch (error) {
    console.error('signAndSend: error:', error);
    queueSetTxStatus(currentItem.id, 'error', {}, error);

    currentItem.txFailedCb && currentItem.txFailedCb(null);
  }
}

async function signAsync (queueSetTxStatus: QueueTxMessageSetStatus, { id, txFailedCb = NOOP, txStartCb = NOOP }: QueueTx, tx: SubmittableExtrinsic<'promise'>, pairOrAddress: KeyringPair | string, options: Partial<SignerOptions>): Promise<string | null> {
  txStartCb();

  try {
    return (await tx.signAsync(pairOrAddress, options)).toJSON();
  } catch (error) {
    queueSetTxStatus(id, 'error', undefined, error);

    txFailedCb(error);
  }

  return null;
}

function signQrPayload (setQrState: (state: QrState) => void): (payload: SignerPayloadJSON) => Promise<SignerResult> {
  return (payload: SignerPayloadJSON): Promise<SignerResult> =>
    new Promise((resolve, reject): void => {
      // limit size of the transaction
      const isQrHashed = (payload.method.length > 5000);
      const wrapper = registry.createType('ExtrinsicPayload', payload, { version: payload.version });
      const qrPayload = isQrHashed
        ? blake2AsU8a(wrapper.toU8a(true))
        : wrapper.toU8a();

      setQrState({
        isQrHashed,
        isQrVisible: true,
        qrAddress: payload.address,
        qrPayload,
        qrReject: reject,
        qrResolve: resolve
      });
    });
}

async function wrapTx (api: ApiPromise, currentItem: QueueTx, { isMultiCall, multiRoot, proxyRoot, signAddress }: AddressProxy): Promise<SubmittableExtrinsic<'promise'>> {
  let tx = currentItem.extrinsic as SubmittableExtrinsic<'promise'>;

  if (proxyRoot) {
    tx = api.tx.proxy.proxy(proxyRoot, null, tx);
  }

  if (multiRoot) {
    const multiModule = api.tx.multisig ? 'multisig' : 'utility';
    const info = await api.query[multiModule].multisigs<Option<Multisig>>(multiRoot, tx.method.hash);
    const { threshold, who } = extractExternal(multiRoot);
    const others = who.filter((w) => w !== signAddress);
    let timepoint: Timepoint | null = null;

    if (info.isSome) {
      timepoint = info.unwrap().when;
    }

    tx = isMultiCall
      ? api.tx[multiModule].asMulti.meta.args.length === 5
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ? api.tx[multiModule].asMulti(threshold, others, timepoint, tx.method, false)
        : api.tx[multiModule].asMulti(threshold, others, timepoint, tx.method)
      : api.tx[multiModule].approveAsMulti(threshold, others, timepoint, tx.method.hash);
  }

  return tx;
}

async function extractParams (address: string, options: Partial<SignerOptions>, setQrState: (state: QrState) => void): Promise<['qr' | 'signing', KeyringPair | string, Partial<SignerOptions>]> {
  const pair = keyring.getPair(address);
  const { meta: { isExternal, isHardware, isInjected, source } } = pair;

  if (isHardware) {
    return ['signing', address, { ...options, signer: ledgerSigner }];
  } else if (isExternal) {
    return ['qr', address, { ...options, signer: { signPayload: signQrPayload(setQrState) } }];
  } else if (isInjected) {
    const injected = await web3FromSource(source as string);

    assert(injected, `Unable to find a signer for ${address}`);

    return ['signing', address, { ...options, signer: injected.signer }];
  }

  return ['signing', pair, options];
}

export default function useSendTx (currentItem: QueueTx): any {
  const { api } = useApi();
  const { queueSetTxStatus, txqueue } = useContext(StatusContext);
  const [flags, setFlags] = useState(extractExternal(requestAddress));
  const [{ isQrHashed, isQrVisible, qrAddress, qrPayload, qrResolve }, setQrState] = useState<QrState>({ isQrHashed: false, isQrVisible: false, qrAddress: '', qrPayload: new Uint8Array() });
  const [isRenderError, toggleRenderError] = useToggle();
  const [isSubmit, setIsSubmit] = useState(true);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [senderInfo, setSenderInfo] = useState<AddressProxy>({ isMultiCall: false, multiRoot: null, proxyRoot: null, signAddress: requestAddress, signPassword: '' });
  const [signedOptions, setSignedOptions] = useState<Partial<SignerOptions>>({});
  const [signedTx, setSignedTx] = useState<string | null>(null);
  const [multiCall, setMultiCall] = useState<string | null>(null);
  const [tip, setTip] = useState(BN_ZERO);

  useEffect((): void => {
    setFlags(extractExternal(senderInfo.signAddress));
    setPasswordError(null);
  }, [senderInfo]);

  // when we are sending the hash only, get the wrapped call for display (proxies if required)
  useEffect((): void => {
    setMultiCall(
      currentItem?.extrinsic && senderInfo.multiRoot
        ? senderInfo.proxyRoot
          ? api.tx.proxy.proxy(senderInfo.proxyRoot, null, currentItem.extrinsic).method.toHex()
          : currentItem.extrinsic.method.toHex()
        : null
    );
  }, [api, currentItem, senderInfo]);

  const _addQrSignature = useCallback(
    ({ signature }: { signature: string }) => qrResolve && qrResolve({
      id: ++qrId,
      signature
    }),
    [qrResolve]
  );

  const _onCancel = useCallback(
    (): void => {
      const { id, signerCb = NOOP, txFailedCb = NOOP } = currentItem;

      queueSetTxStatus(id, 'cancelled');
      signerCb(id, null);
      txFailedCb(null);
    },
    [currentItem, queueSetTxStatus]
  );

  const _unlock = useCallback(
    (): boolean => {
      const passwordError = senderInfo.signAddress && flags.isUnlockable
        ? unlockAccount(senderInfo)
        : null;

      setPasswordError(passwordError);

      return !passwordError;
    },
    [flags, senderInfo]
  );

  const _onSendPayload = useCallback(
    (): void => {
      if (_unlock() && senderInfo.signAddress && currentItem.payload) {
        const { id, payload, signerCb = NOOP } = currentItem;
        const pair = keyring.getPair(senderInfo.signAddress);
        const result = registry.createType('ExtrinsicPayload', payload, { version: payload.version }).sign(pair);

        signerCb(id, { id, ...result });
        queueSetTxStatus(id, 'completed');
      }
    },
    [_unlock, currentItem, queueSetTxStatus, senderInfo]
  );

  const _onSend = useCallback(
    async (): Promise<void> => {
      if (_unlock() && senderInfo.signAddress) {
        const [tx, [status, pairOrAddress, options]] = await Promise.all([
          wrapTx(api, currentItem, senderInfo),
          extractParams(senderInfo.signAddress, { tip }, setQrState)
        ]);

        queueSetTxStatus(currentItem.id, status);

        await signAndSend(queueSetTxStatus, currentItem, tx, pairOrAddress, options);
      }
    },
    [_unlock, api, currentItem, queueSetTxStatus, senderInfo, tip]
  );

  const _onSign = useCallback(
    async (): Promise<void> => {
      if (_unlock() && senderInfo.signAddress) {
        const [tx, [, pairOrAddress, options]] = await Promise.all([
          wrapTx(api, currentItem, senderInfo),
          extractParams(senderInfo.signAddress, { ...signedOptions, tip }, setQrState)
        ]);

        setSignedTx(await signAsync(queueSetTxStatus, currentItem, tx, pairOrAddress, options));
      }
    },
    [_unlock, api, currentItem, queueSetTxStatus, senderInfo, signedOptions, tip]
  );

  return item;
}
