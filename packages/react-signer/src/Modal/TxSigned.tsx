// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { QueueTx, QueueTxMessageSetStatus, QueueTxResult, QueueTxStatus } from '@polkadot/react-components/Status/types';

import React, { useCallback, useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { ApiPromise } from '@polkadot/api';
import { Button, ErrorBoundary, Modal, StatusContext } from '@polkadot/react-components';
import { useApi, useIsMountedRef, useToggle } from '@polkadot/react-hooks';
import keyring from '@polkadot/ui-keyring';
import { BN_ZERO, isFunction } from '@polkadot/util';

import { useTranslation } from '../translate';
import AddressOrProxy from './Address';
import Tip from './Tip';
import Transaction from './Transaction';
import Password from './Password';
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

      setPasswordError(passwordError);
    },
    [address, flags, password]
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
                <AddressOrProxy
                  currentItem={currentItem}
                  onChange={setAddress}
                  requestAddress={requestAddress}
                >
                  <Transaction
                    currentItem={currentItem}
                    onError={toggleRenderError}
                  />
                  <Tip onChange={setTip} />
                </AddressOrProxy>
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
