// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SignerOptions, SignerResult, SubmittableExtrinsic } from '@polkadot/api/types';
import { KeyringPair } from '@polkadot/keyring/types';
import { QueueTx, QueueTxMessageSetStatus, QueueTxResult, QueueTxStatus } from '@polkadot/react-components/Status/types';
import { SignerPayloadJSON } from '@polkadot/types/types';

import React, { useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ApiPromise, SubmittableResult } from '@polkadot/api';
import { web3FromSource } from '@polkadot/extension-dapp';
import { Button, ErrorBoundary, Modal, StatusContext } from '@polkadot/react-components';
import { useApi, useIsMountedRef, useToggle } from '@polkadot/react-hooks';
import keyring from '@polkadot/ui-keyring';
import { BN_ZERO, assert, isFunction } from '@polkadot/util';

import ledgerSigner from '../LedgerSigner';
import { useTranslation } from '../translate';
import Address from './Address';
import Password from './Password';
import Tip from './Tip';
import Transaction from './Transaction';
import { extractExternal } from './util';

interface Props {
  className?: string;
  currentItem: QueueTx;
  requestAddress: string;
}

function unlockAccount (accountId: string, password: string): string | null {
  let publicKey;

  try {
    publicKey = keyring.decodeAddress(accountId);
  } catch (error) {
    console.error(error);

    return 'unable to decode address';
  }

  const pair = keyring.getPair(publicKey);

  try {
    pair.decodePkcs8(password);
  } catch (error) {
    console.error(error);

    return (error as Error).message;
  }

  return null;
}

async function makeExtrinsicCall (api: ApiPromise, queueSetTxStatus: QueueTxMessageSetStatus, { id, txFailedCb, txStartCb, txSuccessCb, txUpdateCb }: QueueTx, tx: SubmittableExtrinsic<'promise'>, pairOrAddress: KeyringPair | string, options: Partial<SignerOptions>): Promise<void> {
  // const { api, queueSetTxStatus } = this.props;
  // const { showTip, tip } = this.state;

  console.log('makeExtrinsicCall: extrinsic ::', tx.toHex());

  queueSetTxStatus(id, 'signing');

  if (isFunction(txStartCb)) {
    txStartCb();
  }

  try {
    const unsubscribe = await tx.signAndSend(pairOrAddress, options, (result: SubmittableResult): void => {
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

      if (result.isCompleted) {
        unsubscribe();
      }
    });

    queueSetTxStatus(id, 'sending');
  } catch (error) {
    console.error('makeExtrinsicCall: error:', error);
    queueSetTxStatus(id, 'error', {}, error);

    if (isFunction(txFailedCb)) {
      txFailedCb(null);
    }
  }
}

function signQrPayload (payload: SignerPayloadJSON): Promise<SignerResult> {
  return new Promise((resolve, reject): void => {
    // limit size of the transaction
    const qrIsHashed = (payload.method.length > 5000);
    const wrapper = registry.createType('ExtrinsicPayload', payload, { version: payload.version });
    const qrPayload = qrIsHashed
      ? blake2AsU8a(wrapper.toU8a(true))
      : wrapper.toU8a();

    this.setState({
      isQrVisible: true,
      qrAddress: payload.address,
      qrIsHashed,
      qrPayload,
      qrReject: reject,
      qrResolve: resolve
    });
  });
};

async function sendTx (api: ApiPromise, queueSetTxStatus: QueueTxMessageSetStatus, address: string, currentItem: QueueTx, options: Partial<SignerOptions>): Promise<void> {
  const pair = keyring.getPair(address);
  const submittable = currentItem.extrinsic as SubmittableExtrinsic<'promise'>;
  const tx = submittable;

  // do multisig stuff here
  // ...

  const { meta: { isExternal, isHardware, isInjected, source } } = pair;
  let pairOrAddress: KeyringPair | string = address;

  // set the signer
  if (isHardware) {
    options.signer = ledgerSigner;
  } else if (isExternal) {
    queueSetTxStatus(currentItem.id, 'qr');
    options.signer = { signPayload: signQrPayload };
  } else if (isInjected) {
    const injected = await web3FromSource(source as string);

    assert(injected, `Unable to find a signer for ${address}`);

    options.signer = injected.signer;
  } else {
    pairOrAddress = pair;
  }

  return makeExtrinsicCall(api, queueSetTxStatus, currentItem, tx, pairOrAddress, options);
}

function TxSigned ({ className, currentItem, requestAddress }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const { t } = useTranslation();
  const { queueSetTxStatus } = useContext(StatusContext);
  const [flags, setFlags] = useState(extractExternal(requestAddress));
  const [isQrVisible, setIsQrVisible] = useState(false);
  const [isRenderError, toggleRenderError] = useToggle();
  const [isSubmit] = useState(true);
  const [address, setAddress] = useState<string | null>(requestAddress);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [tip, setTip] = useState(BN_ZERO);
  const mountedRef = useIsMountedRef();

  useEffect((): void => {
    setFlags(extractExternal(address));
    setPasswordError(null);
  }, [address, api, currentItem, mountedRef]);

  const _activateQr = useCallback(
    () => setIsQrVisible(true),
    []
  );

  const _onCancel = useCallback(
    (): void => {
      const { id, signerCb, txFailedCb } = currentItem;

      queueSetTxStatus(id, 'cancelled');
      isFunction(signerCb) && signerCb(id, null);
      isFunction(txFailedCb) && txFailedCb(null);
    },
    [currentItem, queueSetTxStatus]
  );

  const _onSend = useCallback(
    (): void => {
      const passwordError = address && flags.isUnlockable
        ? unlockAccount(address, password)
        : null;

      if (passwordError || !address) {
        setPasswordError(passwordError);

        return;
      }

      sendTx(api, queueSetTxStatus, address, currentItem, { tip }).catch(console.error);
    },
    [address, api, currentItem, flags, password, queueSetTxStatus, tip]
  );

  const _setPassword = useCallback(
    (password: string): void => {
      setPassword(password);
      setPasswordError(null);
    },
    []
  );

  return (
    <>
      <Modal.Content className={className}>
        <ErrorBoundary onError={toggleRenderError}>
          {isQrVisible
            ? (
              // <Modal.Columns>
              //   <Modal.Column>
              //     <Qr
              //       address={qrAddress}
              //       genesisHash={api.genesisHash}
              //       isHashed={qrIsHashed}
              //       isScanning={isQrScanning}
              //       onSignature={this.addQrSignature}
              //       payload={qrPayload}
              //     />
              //   </Modal.Column>
              //   <Modal.Column>
              //     {isQrScanning
              //       ? <p>{t<string>('Present the QR code containing the signature to the UI. Once scanned it will be submitted for on-chain processing and execution.')}</p>
              //       : <p>{t<string>('Scan the QR code with your QR scanner. Once approved, you will be required to present the signed QR back to the UI for submission.')}</p>
              //     }
              //   </Modal.Column>
              // </Modal.Columns>
              <div>QR!!!!</div>
            )
            : (
              <>
                <Address
                  currentItem={currentItem}
                  onChange={setAddress}
                  requestAddress={requestAddress}
                >
                  <Transaction
                    currentItem={currentItem}
                    onError={toggleRenderError}
                  />
                  <Tip onChange={setTip} />
                </Address>
                {flags.isUnlockable && (
                  <Password
                    address={address}
                    error={passwordError}
                    onChange={_setPassword}
                  />
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
              : 'sign-in'
          }
          isDisabled={!address}
          isPrimary
          label={
            isQrVisible
              ? t<string>('Scan Signature Qr')
              : flags.isQr
                ? t<string>('Sign via Qr')
                : isSubmit
                  ? t<string>('Sign and Submit')
                  : t<string>('Sign (no submission)')
          }
          onClick={isQrVisible ? _activateQr : _onSend}
          tabIndex={2}
        />
      </Modal.Actions>
    </>
  );
}

export default React.memo(styled(TxSigned)``);
