// Copyright 2017-2025 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

// This is for the use of `Ledger`
//
/* eslint-disable deprecation/deprecation */

import type { ApiPromise } from '@polkadot/api';
import type { SignerOptions } from '@polkadot/api/submittable/types';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { Ledger, LedgerGeneric } from '@polkadot/hw-ledger';
import type { KeyringPair } from '@polkadot/keyring/types';
import type { QueueTx, QueueTxMessageSetStatus } from '@polkadot/react-components/Status/types';
import type { Option } from '@polkadot/types';
import type { Multisig, Timepoint } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';
import type { HexString } from '@polkadot/util/types';
import type { AddressFlags, AddressProxy, ExtendedSignerOptions, QrState } from './types.js';

import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { web3FromSource } from '@polkadot/extension-dapp';
import { Button, ErrorBoundary, Modal, Output, styled, Toggle } from '@polkadot/react-components';
import { useApi, useLedger, useQueue, useToggle } from '@polkadot/react-hooks';
import { keyring } from '@polkadot/ui-keyring';
import { settings } from '@polkadot/ui-settings';
import { assert, nextTick } from '@polkadot/util';
import { addressEq } from '@polkadot/util-crypto';

import { AccountSigner, LedgerSigner, QrSigner } from './signers/index.js';
import Address from './Address.js';
import PayWithAsset from './PayWithAsset.js';
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
    if (!signAddress) {
      throw new Error('Invalid signAddress');
    }

    publicKey = keyring.decodeAddress(signAddress);
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

async function fakeSignForChopsticks (api: ApiPromise, tx: SubmittableExtrinsic<'promise'>, sender: string): Promise<void> {
  const account = await api.query.system.account(sender);
  const options = {
    blockHash: api.genesisHash,
    genesisHash: api.genesisHash,
    nonce: account.nonce,
    runtimeVersion: api.runtimeVersion
  };
  const mockSignature = new Uint8Array(64);

  mockSignature.fill(0xcd);
  mockSignature.set([0xde, 0xad, 0xbe, 0xef]);
  tx.signFake(sender, options);
  tx.signature.set(mockSignature);
}

async function signAndSend (queueSetTxStatus: QueueTxMessageSetStatus, currentItem: QueueTx, tx: SubmittableExtrinsic<'promise'>, pairOrAddress: KeyringPair | string, options: Partial<SignerOptions>, api: ApiPromise, isMockSign: boolean): Promise<void> {
  currentItem.txStartCb && currentItem.txStartCb();

  try {
    if (!isMockSign) {
      await tx.signAsync(pairOrAddress, options);
    } else {
      await fakeSignForChopsticks(api, tx, pairOrAddress as string);
    }

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

async function signAsync (queueSetTxStatus: QueueTxMessageSetStatus, { id, txFailedCb = NOOP, txStartCb = NOOP }: QueueTx, tx: SubmittableExtrinsic<'promise'>, pairOrAddress: KeyringPair | string, options: Partial<SignerOptions>, api: ApiPromise, isMockSign: boolean): Promise<string | null> {
  txStartCb();

  try {
    if (!isMockSign) {
      await tx.signAsync(pairOrAddress, options);
    } else {
      await fakeSignForChopsticks(api, tx, pairOrAddress as string);
    }

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

async function extractParams (api: ApiPromise, address: string, options: Partial<SignerOptions>, getLedger: () => LedgerGeneric | Ledger, setQrState: (state: QrState) => void): Promise<['qr' | 'signing', string, Partial<SignerOptions>, boolean]> {
  const pair = keyring.getPair(address);
  const { meta: { accountOffset, addressOffset, isExternal, isHardware, isInjected, isLocal, isProxied, source } } = pair;

  if (isHardware) {
    return ['signing', address, { ...options, signer: new LedgerSigner(api, getLedger, accountOffset || 0, addressOffset || 0) }, false];
  } else if (isLocal) {
    return ['signing', address, { ...options, signer: new AccountSigner(api.registry, pair) }, true];
  } else if (isExternal && !isProxied) {
    return ['qr', address, { ...options, signer: new QrSigner(api.registry, setQrState) }, false];
  } else if (isInjected) {
    if (!source) {
      throw new Error(`Unable to find injected source for ${address}`);
    }

    const injected = await web3FromSource(source);

    assert(injected, `Unable to find a signer for ${address}`);

    return ['signing', address, { ...options, signer: injected.signer }, false];
  }

  assert(addressEq(address, pair.address), `Unable to retrieve keypair for ${address}`);

  return ['signing', address, { ...options, signer: new AccountSigner(api.registry, pair) }, false];
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
  const [signedOptions, setSignedOptions] = useState<ExtendedSignerOptions>({});
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
            const currApp = settings.get().ledgerApp;
            const ledger = getLedger();

            if (currApp === 'migration' || currApp === 'generic') {
              const { address } = await (ledger as LedgerGeneric).getAddress(api.consts.system.ss58Prefix.toNumber(), false, flags.accountOffset, flags.addressOffset);

              console.log(`Signing with Ledger address ${address}`);
            } else {
              const { address } = await (ledger as Ledger).getAddress(false, flags.accountOffset, flags.addressOffset);

              console.log(`Signing with Ledger address ${address}`);
            }
          } catch (error) {
            console.error(error);

            const errorMessage = (error as Error).message;

            passwordError = t('Unable to connect to the Ledger, ensure support is enabled in settings and no other app is using it. {{errorMessage}}', { replace: { errorMessage } });
          }
        }
      }

      setPasswordError(passwordError);

      return !passwordError;
    },
    [flags, getLedger, senderInfo, t, api.consts.system.ss58Prefix]
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
        const [tx, [status, pairOrAddress, options, isMockSign]] = await Promise.all([
          wrapTx(api, currentItem, senderInfo),
          extractParams(api, senderInfo.signAddress, { nonce: -1, tip, withSignedTransaction: true, ...signedOptions }, getLedger, setQrState)
        ]);

        queueSetTxStatus(currentItem.id, status);

        await signAndSend(queueSetTxStatus, currentItem, tx, pairOrAddress, options, api, isMockSign);
      }
    },
    [api, getLedger, signedOptions, tip]
  );

  const _onSign = useCallback(
    async (queueSetTxStatus: QueueTxMessageSetStatus, currentItem: QueueTx, senderInfo: AddressProxy): Promise<void> => {
      if (senderInfo.signAddress) {
        const [tx, [, pairOrAddress, options, isMockSign]] = await Promise.all([
          wrapTx(api, currentItem, senderInfo),
          extractParams(api, senderInfo.signAddress, { ...signedOptions, tip, withSignedTransaction: true }, getLedger, setQrState)
        ]);

        setSignedTx(await signAsync(queueSetTxStatus, currentItem, tx, pairOrAddress, options, api, isMockSign));
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

  const signLabel = useMemo(() => {
    if (flags.isQr) {
      return t('Sign via Qr');
    } else if (isSubmit) {
      if (flags.isLocal) {
        return t('Mock Sign and Submit');
      } else {
        return t('Sign and Submit');
      }
    } else {
      if (flags.isLocal) {
        return t('Mock Sign (no submission)');
      } else {
        return t('Sign (no submission)');
      }
    }
  }, [flags.isQr, flags.isLocal, isSubmit, t]);

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
                  signerOptions={signedOptions}
                />
                <Address
                  currentItem={currentItem}
                  onChange={setSenderInfo}
                  onEnter={_doStart}
                  passwordError={passwordError}
                  requestAddress={requestAddress}
                />
                {!currentItem.payload && (
                  <>
                    <PayWithAsset onChangeFeeAsset={setSignedOptions} />
                    <Tip onChange={setTip} />
                  </>
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
                      label={t('multisig call data')}
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
                      label={t('call hash')}
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
          label={signLabel}
          onClick={_doStart}
          tabIndex={2}
        />
        <div className='signToggle'>
          {!isBusy && (
            <Toggle
              isDisabled={!!currentItem.payload}
              label={
                isSubmit
                  ? t('Sign and Submit')
                  : t('Sign (no submission)')
              }
              onChange={setIsSubmit}
              value={isSubmit}
            />
          )}
          {isAutoCapable && (
            <Toggle
              label={
                isQueueSubmit
                  ? t('Submit {{queueSize}} items', { replace: { queueSize } })
                  : t('Submit individual')
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
