// Copyright 2017-2020 @canvas-ui/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { QueueTx, QueueTxMessageSetStatus, QueueTxResult } from '@canvas-ui/react-components/Status/types';
import { DefinitionRpcExt } from '@polkadot/types/types';

import { useContext, useEffect, useState } from 'react';
import { ApiPromise } from '@polkadot/api';
import { registry } from '@canvas-ui/react-api';
import { StatusContext } from '@canvas-ui/react-components';
import { useApi } from '@canvas-ui/react-hooks';
import { assert, isFunction } from '@polkadot/util';
import { format } from '@polkadot/util/logger';

export interface ItemState {
  currentItem: QueueTx | null;
  requestAddress: string | null;
}

async function submitRpc (api: ApiPromise, { method, section }: DefinitionRpcExt, values: any[]): Promise<QueueTxResult> {
  try {
    const rpc = api.rpc as Record<string, Record<string, (...params: unknown[]) => Promise<unknown>>>;

    assert(isFunction(rpc[section] && rpc[section][method]), `api.rpc.${section}.${method} does not exist`);

    const result = await rpc[section][method](...values);

    console.log('submitRpc: result ::', format(result));

    return {
      result,
      status: 'sent'
    };
  } catch (error) {
    console.error(error);

    return {
      error: error as Error,
      status: 'error'
    };
  }
}

async function sendRpc (api: ApiPromise, queueSetTxStatus: QueueTxMessageSetStatus, { id, rpc, values = [] }: QueueTx): Promise<void> {
  if (rpc) {
    queueSetTxStatus(id, 'sending');

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const { error, result, status } = await submitRpc(api, rpc, values);

    queueSetTxStatus(id, status, result, error);
  }
}

function extractCurrent (api: ApiPromise, queueSetTxStatus: QueueTxMessageSetStatus, txqueue: QueueTx[], filter?: string): ItemState {
  const nextItem = txqueue.find(({ status }) => ['queued', 'qr'].includes(status)) || null;
  let currentItem = null;

  // when the next up is an RPC, send it immediately
  if (nextItem && nextItem.status === 'queued' && !(nextItem.extrinsic || nextItem.payload)) {
    sendRpc(api, queueSetTxStatus, nextItem).catch(console.error);
  } else {
    if (nextItem && nextItem.extrinsic?.callIndex) {
      const { method, section } = registry.findMetaCall(nextItem.extrinsic.callIndex);

      if (!filter || `${section}.${method}` === filter) {
        currentItem = nextItem;
      }
    }
  }

  return {
    currentItem,
    requestAddress: (currentItem && currentItem.accountId) || null
  };
}

export default function usePendingTx (signature?: string): ItemState {
  const { api } = useApi();
  const { queueSetTxStatus, txqueue } = useContext(StatusContext);
  const [item, setItem] = useState<ItemState>({ currentItem: null, requestAddress: null });

  useEffect(
    (): void => {
      setItem(extractCurrent(api, queueSetTxStatus, txqueue, signature));
    },
    [api, queueSetTxStatus, signature, txqueue]
  );

  return item;
}
