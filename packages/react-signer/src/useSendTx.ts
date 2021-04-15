// Copyright 2017-2021 @canvas-ui/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { registry } from '@canvas-ui/react-api';
import { QueueTx, QueueTxMessageSetStatus } from '@canvas-ui/react-api/Status/types';
import { StatusContext } from '@canvas-ui/react-components';
import { useApi } from '@canvas-ui/react-hooks';
import { StringOrNull, VoidFn } from '@canvas-ui/react-util/types';
import BN from 'bn.js';
import { useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { ApiPromise } from '@polkadot/api';
import { SignerOptions } from '@polkadot/api/submittable/types';
import { SignerResult, SubmittableExtrinsic } from '@polkadot/api/types';
import { web3FromSource } from '@polkadot/extension-dapp';
import { KeyringPair } from '@polkadot/keyring/types';
import { Option } from '@polkadot/types';
import { Multisig, Timepoint } from '@polkadot/types/interfaces';
import { SignerPayloadJSON } from '@polkadot/types/types';
import keyring from '@polkadot/ui-keyring';
import { assert, BN_ZERO } from '@polkadot/util';
import { blake2AsU8a } from '@polkadot/util-crypto';

import ledgerSigner from './LedgerSigner';
import { AddressFlags, AddressProxy } from './types';
import { extractExternal, handleTxResults } from './util';

interface UseSendTx {
  addQrSignature: (_: { signature: string }) => void;
  flags: AddressFlags;
  multiCall: StringOrNull;
  onCancel: VoidFn;
  onSend: () => Promise<void>;
  onSendPayload: VoidFn;
  onSendUnsigned: () => Promise<void>;
  onSign: () => Promise<void>;
  passwordError: StringOrNull;
  qrState: QrState;
  senderInfo: AddressProxy;
  setFlags: React.Dispatch<AddressFlags>;
  setMultiCall: React.Dispatch<StringOrNull>;
  setPasswordError: React.Dispatch<StringOrNull>;
  setQrState: React.Dispatch<QrState>;
  setSenderInfo: React.Dispatch<AddressProxy>;
  setSignedOptions: React.Dispatch<Partial<SignerOptions>>;
  setSignedTx: React.Dispatch<StringOrNull>;
  setTip: React.Dispatch<BN>;
  signedOptions: Partial<SignerOptions>;
  signedTx: StringOrNull;
  tip: BN;
  tx: QueueTx | null;
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

async function sendUnsigned (queueSetTxStatus: QueueTxMessageSetStatus, currentItem: QueueTx, tx: SubmittableExtrinsic<'promise'>): Promise<void> {
  currentItem.txStartCb && currentItem.txStartCb();

  try {
    const unsubscribe = await tx.send(handleTxResults('send', queueSetTxStatus, currentItem, (): void => {
      unsubscribe();
    }));
  } catch (error) {
    console.error('send: error:', error);
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
    const { weight } = await tx.paymentInfo(multiRoot);
    const { threshold, who } = extractExternal(multiRoot);
    const others = who.filter((w) => w !== signAddress);
    let timepoint: Timepoint | null = null;

    if (info.isSome) {
      timepoint = info.unwrap().when;
    }

    tx = isMultiCall
      ? api.tx[multiModule].asMulti.meta.args.length === 6
        // We are doing toHex here since we have a Vec<u8> input
        ? api.tx[multiModule].asMulti(threshold, others, timepoint, tx.method.toHex(), false, weight)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        : api.tx[multiModule].asMulti(threshold, others, timepoint, tx.method)
      : api.tx[multiModule].approveAsMulti.meta.args.length === 5
        ? api.tx[multiModule].approveAsMulti(threshold, others, timepoint, tx.method.hash, weight)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
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

let qrId = 0;

export default function useSendTx (source: QueueTx | null, requestAddress: string): UseSendTx {
  const currentItem = useMemo((): QueueTx | null => source, [source]);
  const { api } = useApi();
  const { queueSetTxStatus } = useContext(StatusContext);
  const [flags, setFlags] = useState(extractExternal(requestAddress));
  const [qrState, setQrState] = useState<QrState>({ isQrHashed: false, isQrVisible: false, qrAddress: '', qrPayload: new Uint8Array() });
  // const [isRenderError, toggleRenderError] = useToggle();
  // const [isSubmit, setIsSubmit] = useState(true);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [senderInfo, setSenderInfo] = useState<AddressProxy>({ isMultiCall: false, isUnlockCached: false, multiRoot: null, proxyRoot: null, signAddress: requestAddress, signPassword: '' });
  const [signedOptions, setSignedOptions] = useState<Partial<SignerOptions>>({});
  const [signedTx, setSignedTx] = useState<string | null>(null);
  const [multiCall, setMultiCall] = useState<string | null>(null);
  const [tip, setTip] = useState(BN_ZERO);
  const { qrResolve } = qrState;

  useEffect((): void => {
    setSenderInfo({ isMultiCall: false, isUnlockCached: false, multiRoot: null, proxyRoot: null, signAddress: requestAddress, signPassword: '' });
  }, [requestAddress]);

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

  const addQrSignature = useCallback(
    ({ signature }: { signature: string }) => qrResolve && qrResolve({
      id: ++qrId,
      signature
    }),
    [qrResolve]
  );

  const onCancel = useCallback(
    (): void => {
      if (currentItem) {
        const { id, signerCb = NOOP, txFailedCb = NOOP } = currentItem;

        queueSetTxStatus(id, 'cancelled');
        signerCb(id, null);
        txFailedCb(null);
      }
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

  const onSendPayload = useCallback(
    (): void => {
      if (_unlock() && senderInfo.signAddress && currentItem?.payload) {
        const { id, payload, signerCb = NOOP } = currentItem;
        const pair = keyring.getPair(senderInfo.signAddress);
        const result = registry.createType('ExtrinsicPayload', payload, { version: payload.version }).sign(pair);

        signerCb(id, { id, ...result });
        queueSetTxStatus(id, 'completed');
      }
    },
    [_unlock, currentItem, queueSetTxStatus, senderInfo]
  );

  const onSend = useCallback(
    async (): Promise<void> => {
      if (_unlock() && currentItem?.extrinsic && senderInfo.signAddress) {
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

  const onSendUnsigned = useCallback(
    async (): Promise<void> => {
      if (currentItem?.extrinsic) {
        await sendUnsigned(queueSetTxStatus, currentItem, currentItem.extrinsic);
      }
    },
    [currentItem, queueSetTxStatus]
  );

  const onSign = useCallback(
    async (): Promise<void> => {
      if (_unlock() && currentItem && senderInfo.signAddress) {
        const [tx, [, pairOrAddress, options]] = await Promise.all([
          wrapTx(api, currentItem, senderInfo),
          extractParams(senderInfo.signAddress, { ...signedOptions, tip }, setQrState)
        ]);

        setSignedTx(await signAsync(queueSetTxStatus, currentItem, tx, pairOrAddress, options));
      }
    },
    [_unlock, api, currentItem, queueSetTxStatus, senderInfo, signedOptions, tip]
  );

  return { addQrSignature, flags, multiCall, onCancel, onSend, onSendPayload, onSendUnsigned, onSign, passwordError, qrState, senderInfo, setFlags, setMultiCall, setPasswordError, setQrState, setSenderInfo, setSignedOptions, setSignedTx, setTip, signedOptions, signedTx, tip, tx: currentItem };
}
