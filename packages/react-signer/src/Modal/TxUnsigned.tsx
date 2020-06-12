// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic } from '@polkadot/api/types';
import { QueueTx, QueueTxMessageSetStatus } from '@polkadot/react-components/Status/types';
import { AddressProxy } from './types';

import React, { useCallback, useContext, useState } from 'react';
import styled from 'styled-components';
import { Button, ErrorBoundary, Modal, StatusContext } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import Address from './Address';
import Transaction from './Transaction';
import { handleTxResults } from './util';

interface Props {
  className?: string;
  currentItem: QueueTx;
  requestAddress: string;
}

const NOOP = () => undefined;

async function send (queueSetTxStatus: QueueTxMessageSetStatus, currentItem: QueueTx, tx: SubmittableExtrinsic<'promise'>): Promise<void> {
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

function TxUnsigned ({ className, currentItem, requestAddress }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { queueSetTxStatus } = useContext(StatusContext);
  const [, toggleRenderError] = useToggle();
  const [senderInfo, setSenderInfo] = useState<AddressProxy>({ address: requestAddress, isMultiAddress: false, isMultiCall: false, isProxyAddress: false, password: '' });

  const _onCancel = useCallback(
    (): void => {
      const { id, signerCb = NOOP, txFailedCb = NOOP } = currentItem;

      queueSetTxStatus(id, 'cancelled');
      signerCb(id, null);
      txFailedCb(null);
    },
    [currentItem, queueSetTxStatus]
  );

  const _onSend = useCallback(
    async (): Promise<void> => {
      if (!senderInfo.address || !currentItem.extrinsic) {
        return;
      }

      await send(queueSetTxStatus, currentItem, currentItem.extrinsic);
    },
    [currentItem, queueSetTxStatus, senderInfo]
  );

  return (
    <>
      <Modal.Content className={className}>
        <ErrorBoundary onError={toggleRenderError}>
          <Transaction
            currentItem={currentItem}
            onError={toggleRenderError}
          />
          <Address
            currentItem={currentItem}
            onChange={setSenderInfo}
            passwordError={null}
            requestAddress={requestAddress}
          />
        </ErrorBoundary>
      </Modal.Content>
      <Modal.Actions onCancel={_onCancel}>
        <Button
          icon='sign-in'
          isPrimary
          label={t('Submit (no signature)')}
          onClick={_onSend}
          tabIndex={2}
        />
      </Modal.Actions>
    </>
  );
}

export default React.memo(styled(TxUnsigned)``);
