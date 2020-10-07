// Copyright 2017-2020 @canvas-ui/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SubmittableExtrinsic } from '@polkadot/api/types';
import { QueueTx, QueueTxMessageSetStatus } from '@canvas-ui/react-components/Status/types';
import { VoidFn } from '@canvas-ui/react-util/types';

import { useCallback, useContext } from 'react';
import { StatusContext } from '@canvas-ui/react-components';
import { handleTxResults } from './util';

interface UseSendUnsigned {
  onCancel: VoidFn;
  onSendUnsigned: () => Promise<void>;
}

const NOOP = () => undefined;

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

export default function useSendTx (currentItem: QueueTx): UseSendUnsigned {
  const { queueSetTxStatus } = useContext(StatusContext);

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

  const onSendUnsigned = useCallback(
    async (): Promise<void> => {
      if (currentItem.extrinsic) {
        await sendUnsigned(queueSetTxStatus, currentItem, currentItem.extrinsic);
      }
    },
    [currentItem, queueSetTxStatus]
  );

  return { onCancel, onSendUnsigned };
}
