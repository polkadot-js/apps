// Copyright 2017-2023 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { SignerOptions } from '@polkadot/api/submittable/types';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { Ledger } from '@polkadot/hw-ledger';
import type { KeyringPair } from '@polkadot/keyring/types';
import type { QueueTx, QueueTxMessageSetStatus } from '@polkadot/react-components/Status/types';
import type { Option } from '@polkadot/types';
import type { Multisig, Timepoint } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';
import type { HexString } from '@polkadot/util/types';
import type { AddressFlags, AddressProxy, QrState } from './types.js';

import React, { useCallback, useEffect, useState } from 'react';

import { web3FromSource } from '@polkadot/extension-dapp';
import { Button, ErrorBoundary, Modal, Output, styled, Toggle } from '@polkadot/react-components';
import { useApi, useLedger, useQueue, useToggle } from '@polkadot/react-hooks';
import { keyring } from '@polkadot/ui-keyring';
import { assert, nextTick } from '@polkadot/util';
import { addressEq } from '@polkadot/util-crypto';

import { AccountSigner, LedgerSigner, QrSigner } from './signers/index.js';
import Address from './Address.js';
import Qr from './Qr.js';
import SignFields from './SignFields.js';
import Tip from './Tip.js';
import Transaction from './Transaction.js';
import { useTranslation } from './translate.js';
import { cacheUnlock, extractExternal, handleTxResults } from './util.js';

interface Props {
  className?: string;
  currentItem: QueueTx;
  isQueueSubmit: boolean;
  queueSize: number;
  requestAddress: string | null;
  setIsQueueSubmit: (isQueueSubmit: boolean) => void;
}

interface InnerTx {
  innerHash: string | null;
  innerTx: string | null;
}

const NOOP = () => undefined;

const EMPTY_INNER: InnerTx = { innerHash: null, innerTx: null };

let qrId = 0;

function unlockAccount ({ isUnlockCached, signAddress, signPassword }: AddressProxy): string | null {
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
    isUnlockCached && cacheUnlock(pair);
  } catch (error) {
    console.error(error);

    return (error as Error).message;
  }

  return null;
}

async function signAndSend (queueSetTxStatus: QueueTxMessageSetStatus, currentItem: QueueTx, tx: SubmittableExtrinsic<'promise'>, pairOrAddress: KeyringPair | string, options: Partial<SignerOptions>): Promise<void> {
  currentItem.txStartCb && currentItem.txStartCb();

  try {
    await tx.signAsync(pairOrAddress, options);

    console.info('sending', tx.toHex());

    queueSetTxStatus(currentItem.id, 'sending');

    const unsubscribe = await tx.send(handleTxResults('signAndSend', queueSetTxStatus, currentItem, (): void => {
      unsubscribe();
    }));
  } catch (error) {
    console.error('signAndSend: error:', error);
    queueSetTxStatus(currentItem.id, 'error', {}, error as Error);

    currentItem.txFailedCb && currentItem.txFailedCb(error as Error);
  }
}

async function signAsync (queueSetTxStatus: QueueTxMessageSetStatus, { id, txFailedCb = NOOP, txStartCb = NOOP }: QueueTx, tx: SubmittableExtrinsic<'promise'>, pairOrAddress: KeyringPair | string, options: Partial<SignerOptions>): Promise<string | null> {
  txStartCb();

  try {
    await tx.signAsync(pairOrAddress, options);

    return tx.toJSON();
  } catch (error) {
    console.error('signAsync: error:', error);
    queueSetTxStatus(id, 'error', undefined, error as Error);

    txFailedCb(error as Error);
  }

  return null;
}

async function wrapTx (api: ApiPromise, currentItem: QueueTx, { isMultiCall, multiRoot, proxyRoot, signAddress }: AddressProxy): Promise<SubmittableExtrinsic<'promise'>> {
  let tx = currentItem.extrinsic as SubmittableExtrinsic<'promise'>;

  if (proxyRoot) {
    tx = api.tx.proxy.proxy(proxyRoot, null, tx);
  }

  if (multiRoot) {
    const multiModule = api.tx.multisig ? 'multisig' : 'utility';
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const [info, { weight }] = await Promise.all([
      api.query[multiModule].multisigs<Option<Multisig>>(multiRoot, tx.method.hash),
      tx.paymentInfo(multiRoot) as Promise<{ weight: any }>
    ]);

    console.log('multisig max weight=', (weight as string).toString());

    const { threshold, who } = extractExternal(multiRoot);
    const others = who.filter((w) => w !== signAddress);
    let timepoint: Timepoint | null = null;

    if (info.isSome) {
      timepoint = info.unwrap().when;
    }

    tx = isMultiCall
      ? api.tx[multiModule].asMulti.meta.args.length === 5
        // We are doing toHex here since we have a Vec<u8> input
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        ? api.tx[multiModule].asMulti(threshold, others, timepoint, tx.method.toHex(), weight)
        : api.tx[multiModule].asMulti.meta.args.length === 6
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          ? api.tx[multiModule].asMulti(threshold, others, timepoint, tx.method.toHex(), false, weight)
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          : api.tx[multiModule].asMulti(threshold, others, timepoint, tx.method)
      : api.tx[multiModule].approveAsMulti.meta.args.length === 5
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        ? api.tx[multiModule].approveAsMulti(threshold, others, timepoint, tx.method.hash, weight)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        : api.tx[multiModule].approveAsMulti(threshold, others, timepoint, tx.method.hash);
  }

  return tx;
}

async function extractParams (api: ApiPromise, address: string, options: Partial<SignerOptions>, getLedger: () => Ledger, setQrState: (state: QrState) => void): Promise<['qr' | 'signing', string, Partial<SignerOptions>]> {
  const pair = keyring.getPair(address);
  const { meta: { accountOffset, addressOffset, isExternal, isHardware, isInjected, isProxied, source } } = pair;

  if (isHardware) {
    return ['signing', address, { ...options, signer: new LedgerSigner(api.registry, getLedger, accountOffset as number || 0, addressOffset as number || 0) }];
  } else if (isExternal && !isProxied) {
    return ['qr', address, { ...options, signer: new QrSigner(api.registry, setQrState) }];
  } else if (isInjected) {
    const injected = await web3FromSource(source as string);

    assert(injected, `Unable to find a signer for ${address}`);

    return ['signing', address, { ...options, signer: injected.signer }];
  }

  assert(addressEq(address, pair.address), `Unable to retrieve keypair for ${address}`);

  return ['signing', address, { ...options, signer: new AccountSigner(api.registry, pair) }];
}

function tryExtract (address: string | null): AddressFlags {
  try {
    return extractExternal(address);
  } catch {
    return {} as AddressFlags;
  }
}

function TxSigned ({ className, currentItem, isQueueSubmit, queueSize, requestAddress, setIsQueueSubmit }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const { getLedger } = useLedger();
  const { queueSetTxStatus } = useQueue();
  const [flags, setFlags] = useState(() => tryExtract(requestAddress));
  const [error, setError] = useState<Error | null>(null);
  const [{ isQrHashed, qrAddress, qrPayload, qrResolve }, setQrState] = useState<QrState>(() => ({ isQrHashed: false, qrAddress: '', qrPayload: new Uint8Array() }));
  const [isBusy, setBusy] = useState(false);
  const [isRenderError, toggleRenderError] = useToggle();
  const [isSubmit, setIsSubmit] = useState(true);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [senderInfo, setSenderInfo] = useState<AddressProxy>(() => ({ isMultiCall: false, isUnlockCached: false, multiRoot: null, proxyRoot: null, signAddress: requestAddress, signPassword: '' }));
  const [signedOptions, setSignedOptions] = useState<Partial<SignerOptions>>({});
  const [signedTx, setSignedTx] = useState<string | null>(null);
  const [{ innerHash, innerTx }, setCallInfo] = useState<InnerTx>(EMPTY_INNER);
  const [tip, setTip] = useState<BN | undefined>();
  const [initialIsQueueSubmit] = useState(isQueueSubmit);

  useEffect((): void => {
    setFlags(tryExtract(senderInfo.signAddress));
    setPasswordError(null);
  }, [senderInfo]);

  // when we are sending the hash only, get the wrapped call for display (proxies if required)
  useEffect((): void => {
    const method = currentItem.extrinsic && (
      senderInfo.proxyRoot
        ? api.tx.proxy.proxy(senderInfo.proxyRoot, null, currentItem.extrinsic)
        : currentItem.extrinsic
    ).method;

    setCallInfo(
      method
        ? {
          innerHash: method.hash.toHex(),
          innerTx: senderInfo.multiRoot
            ? method.toHex()
            : null
        }
        : EMPTY_INNER
    );
  }, [api, currentItem, senderInfo]);

  const _addQrSignature = useCallback(
    ({ signature }: { signature: string }) => qrResolve && qrResolve({
      id: ++qrId,
      signature: signature as HexString
    }),
    [qrResolve]
  );

  const _unlock = useCallback(
    async (): Promise<boolean> => {
      let passwordError: string | null = null;

      if (senderInfo.signAddress) {
        if (flags.isUnlockable) {
          passwordError = unlockAccount(senderInfo);
        } else if (flags.isHardware) {
          try {
            const ledger = getLedger();
            const { address } = await ledger.getAddress(false, flags.accountOffset, flags.addressOffset);

            console.log(`Signing with Ledger address ${address}`);
          } catch (error) {
            console.error(error);

            passwordError = t<string>('Unable to connect to the Ledger, ensure support is enabled in settings and no other app is using it. {{error}}', { replace: { error: (error as Error).message } });
          }
        }
      }

      setPasswordError(passwordError);

      return !passwordError;
    },
    [flags, getLedger, senderInfo, t]
  );

  const _onSendPayload = useCallback(
    (queueSetTxStatus: QueueTxMessageSetStatus, currentItem: QueueTx, senderInfo: AddressProxy): void => {
      if (senderInfo.signAddress && currentItem.payload) {
        const { id, payload, signerCb = NOOP } = currentItem;
        const pair = keyring.getPair(senderInfo.signAddress);
        const result = api.createType('ExtrinsicPayload', payload, { version: payload.version }).sign(pair);

        signerCb(id, { id, ...result });
        queueSetTxStatus(id, 'completed');
      }
    },
    [api]
  );

  const _onSend = useCallback(
    async (queueSetTxStatus: QueueTxMessageSetStatus, currentItem: QueueTx, senderInfo: AddressProxy): Promise<void> => {
      if (senderInfo.signAddress) {
        const [tx, [status, pairOrAddress, options]] = await Promise.all([
          wrapTx(api, currentItem, senderInfo),
          extractParams(api, senderInfo.signAddress, { nonce: -1, tip }, getLedger, setQrState)
        ]);

        queueSetTxStatus(currentItem.id, status);

        await signAndSend(queueSetTxStatus, currentItem, tx, pairOrAddress, options);
      }
    },
    [api, getLedger, tip]
  );

  const _onSign = useCallback(
    async (queueSetTxStatus: QueueTxMessageSetStatus, currentItem: QueueTx, senderInfo: AddressProxy): Promise<void> => {
      if (senderInfo.signAddress) {
        const [tx, [, pairOrAddress, options]] = await Promise.all([
          wrapTx(api, currentItem, senderInfo),
          extractParams(api, senderInfo.signAddress, { ...signedOptions, tip }, getLedger, setQrState)
        ]);

        setSignedTx(await signAsync(queueSetTxStatus, currentItem, tx, pairOrAddress, options));
      }
    },
    [api, getLedger, signedOptions, tip]
  );

  const _doStart = useCallback(
    (): void => {
      setBusy(true);

      nextTick((): void => {
        const errorHandler = (error: Error): void => {
          console.error(error);

          setBusy(false);
          setError(error);
        };

        _unlock()
          .then((isUnlocked): void => {
            if (isUnlocked) {
              isSubmit
                ? currentItem.payload
                  ? _onSendPayload(queueSetTxStatus, currentItem, senderInfo)
                  : _onSend(queueSetTxStatus, currentItem, senderInfo).catch(errorHandler)
                : _onSign(queueSetTxStatus, currentItem, senderInfo).catch(errorHandler);
            } else {
              setBusy(false);
            }
          })
          .catch((error): void => {
            errorHandler(error as Error);
          });
      });
    },
    [_onSend, _onSendPayload, _onSign, _unlock, currentItem, isSubmit, queueSetTxStatus, senderInfo]
  );

  const isAutoCapable = senderInfo.signAddress && (queueSize > 1) && isSubmit && !(flags.isHardware || flags.isMultisig || flags.isProxied || flags.isQr || flags.isUnlockable) && !isRenderError;

  if (!isBusy && isAutoCapable && initialIsQueueSubmit) {
    setBusy(true);
    setTimeout(_doStart, 1000);

    return null;
  }

  return (
    <>
      <StyledModalContent className={className}>
        <ErrorBoundary
          error={error}
          onError={toggleRenderError}
        >
          {(isBusy && flags.isQr)
            ? (
              <Qr
                address={qrAddress}
                genesisHash={api.genesisHash}
                isHashed={isQrHashed}
                onSignature={_addQrSignature}
                payload={qrPayload}
              />
            )
            : (
              <>
                <Transaction
                  accountId={senderInfo.signAddress}
                  currentItem={currentItem}
                  onError={toggleRenderError}
                />
                <Address
                  currentItem={currentItem}
                  onChange={setSenderInfo}
                  onEnter={_doStart}
                  passwordError={passwordError}
                  requestAddress={requestAddress}
                />
                {!currentItem.payload && (
                  <Tip onChange={setTip} />
                )}
                {!isSubmit && (
                  <SignFields
                    address={senderInfo.signAddress}
                    onChange={setSignedOptions}
                    signedTx={signedTx}
                  />
                )}
                {isSubmit && !senderInfo.isMultiCall && innerTx && (
                  <Modal.Columns hint={t('The full call data that can be supplied to a final call to multi approvals')}>
                    <Output
                      isDisabled
                      isTrimmed
                      label={t<string>('multisig call data')}
                      value={innerTx}
                      withCopy
                    />
                  </Modal.Columns>
                )}
                {isSubmit && innerHash && (
                  <Modal.Columns hint={t('The call hash as calculated for this transaction')}>
                    <Output
                      isDisabled
                      isTrimmed
                      label={t<string>('call hash')}
                      value={innerHash}
                      withCopy
                    />
                  </Modal.Columns>
                )}
              </>
            )
          }
        </ErrorBoundary>
      </StyledModalContent>
      <Modal.Actions>
        <Button
          icon={
            flags.isQr
              ? 'qrcode'
              : 'sign-in-alt'
          }
          isBusy={isBusy}
          isDisabled={!senderInfo.signAddress || isRenderError}
          label={
            flags.isQr
              ? t<string>('Sign via Qr')
              : isSubmit
                ? t<string>('Sign and Submit')
                : t<string>('Sign (no submission)')
          }
          onClick={_doStart}
          tabIndex={2}
        />
        <div className='signToggle'>
          {!isBusy && (
            <Toggle
              isDisabled={!!currentItem.payload}
              label={
                isSubmit
                  ? t<string>('Sign and Submit')
                  : t<string>('Sign (no submission)')
              }
              onChange={setIsSubmit}
              value={isSubmit}
            />
          )}
          {isAutoCapable && (
            <Toggle
              label={
                isQueueSubmit
                  ? t<string>('Submit {{queueSize}} items', { replace: { queueSize } })
                  : t<string>('Submit individual')
              }
              onChange={setIsQueueSubmit}
              value={isQueueSubmit}
            />
          )}
        </div>
      </Modal.Actions>
    </>
  );
}

const StyledModalContent = styled(Modal.Content)`
  .tipToggle {
    width: 100%;
    text-align: right;
  }

  .ui--Checks {
    margin-top: 0.75rem;
  }
`;

export default React.memo(TxSigned);
