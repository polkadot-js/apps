// Copyright 2017-2022 @polkadot/react-signer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { QueueTx, QueueTxMessageSetStatus } from '@polkadot/react-components/Status/types';

import React, { useCallback, useContext } from 'react';

import { Button, ErrorBoundary, Modal, StatusContext } from '@polkadot/react-components';
import { useToggle } from '@polkadot/react-hooks';

import Transaction from './Transaction';
import { useTranslation } from './translate';
import { handleTxResults } from './util';

interface Props {
  className?: string;
  currentItem: QueueTx;
}

async function send (queueSetTxStatus: QueueTxMessageSetStatus, currentItem: QueueTx, tx: SubmittableExtrinsic<'promise'>): Promise<void> {
  currentItem.txStartCb && currentItem.txStartCb();

  try {
    const unsubscribe = await tx.send(handleTxResults('send', queueSetTxStatus, currentItem, (): void => {
      unsubscribe();
    }));
  } catch (error) {
    console.error('send: error:', error);
    queueSetTxStatus(currentItem.id, 'error', {}, error as Error);

    currentItem.txFailedCb && currentItem.txFailedCb(null);
  }
}

function TxUnsigned ({ className, currentItem }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { queueSetTxStatus } = useContext(StatusContext);
  const [isRenderError, toggleRenderError] = useToggle();

  const _onSend = useCallback(
    async (): Promise<void> => {
      if (currentItem.extrinsic) {
        await send(queueSetTxStatus, currentItem, currentItem.extrinsic);
      }
    },
    [currentItem, queueSetTxStatus]
  );

  return (
    <>
      <Modal.Content className={className}>
        <ErrorBoundary onError={toggleRenderError}>
          <Transaction
            currentItem={currentItem}
            onError={toggleRenderError}
          />
        </ErrorBoundary>
      </Modal.Content>
      <Modal.Actions>
        <Button
          icon='sign-in-alt'
          isDisabled={isRenderError}
          label={t('Submit (no signature)')}
          onClick={_onSend}
          tabIndex={2}
        />
      </Modal.Actions>
    </>
  );
}

export default React.memo(TxUnsigned);
