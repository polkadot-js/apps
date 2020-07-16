// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SubmittableExtrinsic } from '@polkadot/api/types';
import { VoidFn } from '@polkadot/react-components/types';
import { QueueTx, QueueTxMessageSetStatus } from '@polkadot/react-components/Status/types';

import { useCallback, useContext } from 'react';
import { StatusContext } from '@polkadot/react-components';
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
