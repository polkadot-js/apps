// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SubmittableExtrinsic } from '@polkadot/api/types';
import { SignerOptions } from '@polkadot/api/submittable/types';
import { KeyringPair } from '@polkadot/keyring/types';
import { QueueTx, QueueTxMessageSetStatus } from '@polkadot/react-components/Status/types';
import { Multisig, Timepoint } from '@polkadot/types/interfaces';
import { AddressProxy, QrState } from './types';

import React, { useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ApiPromise } from '@polkadot/api';
import { web3FromSource } from '@polkadot/extension-dapp';
import { registry } from '@polkadot/react-api';
import { Button, ErrorBoundary, Modal, Output, StatusContext, Toggle } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';
import { Option } from '@polkadot/types';
import keyring from '@polkadot/ui-keyring';
import { BN_ZERO, assert } from '@polkadot/util';

import { AccountSigner, LedgerSigner, QrSigner } from './signers';
import { useTranslation } from './translate';
import Address from './Address';
import Qr from './Qr';
import SignFields from './SignFields';
import Tip from './Tip';
import Transaction from './Transaction';
import { cacheUnlock, extractExternal, handleTxResults } from './util';

interface Props {
  className?: string;
  currentItem: QueueTx;
  requestAddress: string;
}

const NOOP = () => undefined;

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

    queueSetTxStatus(currentItem.id, 'sending');

    const unsubscribe = await tx.send(handleTxResults('signAndSend', queueSetTxStatus, currentItem, (): void => {
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
    await tx.signAsync(pairOrAddress, options);

    return tx.toJSON();
  } catch (error) {
    queueSetTxStatus(id, 'error', undefined, error);

    txFailedCb(error);
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

async function extractParams (address: string, options: Partial<SignerOptions>, setQrState: (state: QrState) => void): Promise<['qr' | 'signing', string, Partial<SignerOptions>]> {
  const pair = keyring.getPair(address);
  const { meta: { accountOffset, addressOffset, isExternal, isHardware, isInjected, source } } = pair;

  if (isHardware) {
    return ['signing', address, { ...options, signer: new LedgerSigner(accountOffset as number || 0, addressOffset as number || 0) }];
  } else if (isExternal) {
    return ['qr', address, { ...options, signer: new QrSigner(setQrState) }];
  } else if (isInjected) {
    const injected = await web3FromSource(source as string);

    assert(injected, `Unable to find a signer for ${address}`);

    return ['signing', address, { ...options, signer: injected.signer }];
  }

  return ['signing', pair.address, { ...options, signer: new AccountSigner(pair) }];
}

function TxSigned ({ className, currentItem, requestAddress }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const { t } = useTranslation();
  const { queueSetTxStatus } = useContext(StatusContext);
  const [flags, setFlags] = useState(extractExternal(requestAddress));
  const [error, setError] = useState<Error | null>(null);
  const [{ isQrHashed, qrAddress, qrPayload, qrResolve }, setQrState] = useState<QrState>({ isQrHashed: false, qrAddress: '', qrPayload: new Uint8Array() });
  const [isBusy, setBusy] = useState(false);
  const [isRenderError, toggleRenderError] = useToggle();
  const [isSubmit, setIsSubmit] = useState(true);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [senderInfo, setSenderInfo] = useState<AddressProxy>({ isMultiCall: false, isUnlockCached: false, multiRoot: null, proxyRoot: null, signAddress: requestAddress, signPassword: '' });
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
      currentItem.extrinsic && senderInfo.multiRoot
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
    (queueSetTxStatus: QueueTxMessageSetStatus, currentItem: QueueTx, senderInfo: AddressProxy): void => {
      if (senderInfo.signAddress && currentItem.payload) {
        const { id, payload, signerCb = NOOP } = currentItem;
        const pair = keyring.getPair(senderInfo.signAddress);
        const result = registry.createType('ExtrinsicPayload', payload, { version: payload.version }).sign(pair);

        signerCb(id, { id, ...result });
        queueSetTxStatus(id, 'completed');
      }
    },
    []
  );

  const _onSend = useCallback(
    async (queueSetTxStatus: QueueTxMessageSetStatus, currentItem: QueueTx, senderInfo: AddressProxy): Promise<void> => {
      if (senderInfo.signAddress) {
        const [tx, [status, pairOrAddress, options]] = await Promise.all([
          wrapTx(api, currentItem, senderInfo),
          extractParams(senderInfo.signAddress, { nonce: -1, tip }, setQrState)
        ]);

        queueSetTxStatus(currentItem.id, status);

        await signAndSend(queueSetTxStatus, currentItem, tx, pairOrAddress, options);
      }
    },
    [api, tip]
  );

  const _onSign = useCallback(
    async (queueSetTxStatus: QueueTxMessageSetStatus, currentItem: QueueTx, senderInfo: AddressProxy): Promise<void> => {
      if (senderInfo.signAddress) {
        const [tx, [, pairOrAddress, options]] = await Promise.all([
          wrapTx(api, currentItem, senderInfo),
          extractParams(senderInfo.signAddress, { ...signedOptions, tip }, setQrState)
        ]);

        setSignedTx(await signAsync(queueSetTxStatus, currentItem, tx, pairOrAddress, options));
      }
    },
    [api, signedOptions, tip]
  );

  const _doStart = useCallback(
    (): void => {
      setBusy(true);

      setTimeout((): void => {
        const errorHandler = (error: Error): void => {
          console.error(error);
          setBusy(false);
          setError(error);
        };

        try {
          if (_unlock()) {
            isSubmit
              ? currentItem.payload
                ? _onSendPayload(queueSetTxStatus, currentItem, senderInfo)
                : _onSend(queueSetTxStatus, currentItem, senderInfo).catch(errorHandler)
              : _onSign(queueSetTxStatus, currentItem, senderInfo).catch(errorHandler);
          } else {
            setBusy(false);
          }
        } catch (error) {
          errorHandler(error as Error);
        }
      }, 0);
    },
    [_onSend, _onSendPayload, _onSign, _unlock, currentItem, isSubmit, queueSetTxStatus, senderInfo]
  );

  return (
    <>
      <Modal.Content className={className}>
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
                {isSubmit && !senderInfo.isMultiCall && multiCall && (
                  <Modal.Columns>
                    <Modal.Column>
                      <Output
                        isFull
                        isTrimmed
                        label={t<string>('multisig call data')}
                        value={multiCall}
                        withCopy
                      />
                    </Modal.Column>
                    <Modal.Column>
                      {t('The call data that can be supplied to a final call to multi approvals')}
                    </Modal.Column>
                  </Modal.Columns>
                )}
              </>
            )
          }
        </ErrorBoundary>
      </Modal.Content>
      <Modal.Actions onCancel={_onCancel}>
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
        {!isBusy && (
          <Toggle
            className='signToggle'
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
      </Modal.Actions>
    </>
  );
}

export default React.memo(styled(TxSigned)`
  .tipToggle {
    width: 100%;
    text-align: right;
  }

  .ui--Checks {
    margin-top: 0.75rem;
  }
`);
