// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { QueueTx } from '@polkadot/react-components/Status/types';

import { useCallback, useContext, useEffect, useState } from 'react';
import { StatusContext } from '@polkadot/react-components';
import { isFunction } from '@polkadot/util';

export default function useCurrentItem (): [() => void, QueueTx | null] {
  const { queueSetTxStatus, txqueue } = useContext(StatusContext);
  const [currentItem, setCurrentItem] = useState<QueueTx | null>(null);

  useEffect((): void => {
    setCurrentItem(
      txqueue.find(({ status }) => ['queued', 'qr'].includes(status)) || null
    );
  }, [txqueue]);

  const cancelCurrent = useCallback(
    (): void => {
      if (currentItem) {
        const { id, signerCb, txFailedCb } = currentItem;

        queueSetTxStatus(id, 'cancelled');

        isFunction(signerCb) && signerCb(id, null);
        isFunction(txFailedCb) && txFailedCb(null);
      }
    },
    [currentItem, queueSetTxStatus]
  );

  return [cancelCurrent, currentItem];
}
