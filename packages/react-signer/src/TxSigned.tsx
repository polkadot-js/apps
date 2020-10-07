// Copyright 2017-2020 @canvas-ui/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { QueueTx } from '@canvas-ui/react-components/Status/types';

import React, { useState } from 'react';
import styled from 'styled-components';
import { Button, ErrorBoundary, Modal, Output, Toggle } from '@canvas-ui/react-components';
import { useApi, useToggle } from '@canvas-ui/react-hooks';

import Address from './Address';
import Qr from './Qr';
import SignFields from './SignFields';
import Tip from './Tip';
import Transaction from './Transaction';
import { useTranslation } from './translate';
import useSendTx from './useSendTx';

interface Props {
  className?: string;
  currentItem: QueueTx;
  requestAddress: string;
}

function TxSigned ({ className, currentItem, requestAddress }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const { t } = useTranslation();
  const {
    addQrSignature,
    flags,
    multiCall,
    onCancel,
    onSend,
    onSendPayload,
    onSign,
    passwordError,
    qrState: { isQrHashed, isQrVisible, qrAddress, qrPayload },
    senderInfo,
    setSenderInfo,
    setSignedOptions,
    setTip,
    signedTx
  } = useSendTx(currentItem, requestAddress);
  const [isRenderError, toggleRenderError] = useToggle();
  const [isSubmit, setIsSubmit] = useState(true);

  return (
    <>
      <Modal.Content className={className}>
        <ErrorBoundary onError={toggleRenderError}>
          {isQrVisible
            ? (
              <Qr
                address={qrAddress}
                genesisHash={api.genesisHash}
                isHashed={isQrHashed}
                onSignature={addQrSignature}
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
                      {t<string>('The call data that can be supplied to a final call to multi approvals')}
                    </Modal.Column>
                  </Modal.Columns>
                )}
              </>
            )
          }
        </ErrorBoundary>
      </Modal.Content>
      <Modal.Actions onCancel={onCancel}>
        {!isQrVisible && (
          <>
            <Button
              icon={
                flags.isQr
                  ? 'qrcode'
                  : 'sign-in'
              }
              isDisabled={!senderInfo.signAddress || isRenderError}
              isPrimary
              label={
                flags.isQr
                  ? t<string>('Sign via Qr')
                  : isSubmit
                    ? t<string>('Sign and Submit')
                    : t<string>('Sign (no submission)')
              }
              onClick={
                isSubmit
                  ? currentItem.payload
                    ? onSendPayload
                    : onSend
                  : onSign
              }
              tabIndex={2}
            />
            <Toggle
              className='signToggle'
              isDisabled={isQrVisible || !!currentItem.payload}
              label={
                isSubmit
                  ? t<string>('Sign and Submit')
                  : t<string>('Sign (no submission)')
              }
              onChange={setIsSubmit}
              value={isSubmit}
            />
          </>
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
