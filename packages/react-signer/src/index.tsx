// Copyright 2017-2020 @polkadot/react-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { QueueTx, QueueTxMessageSetStatus, QueueTxResult } from '@polkadot/react-components/Status/types';
import { BareProps } from '@polkadot/react-components/types';
import { DefinitionRpcExt } from '@polkadot/types/types';

import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ApiPromise } from '@polkadot/api';
import { StatusContext } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { assert, isFunction } from '@polkadot/util';
import { format } from '@polkadot/util/logger';

import Modal from './Modal';

interface Props extends BareProps {
  children: React.ReactNode;
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
  if (!rpc) {
    return;
  }

  queueSetTxStatus(id, 'sending');

  const reply = await submitRpc(api, rpc, values);

  queueSetTxStatus(id, reply.status, reply.result, reply.error);
}

function Signer ({ children, className = '' }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const { queueSetTxStatus, txqueue } = useContext(StatusContext);
  const [currentItem, setCurrentItem] = useState<QueueTx | null>(null);

  const _sendRpc = useCallback(
    (currentItem: QueueTx) => sendRpc(api, queueSetTxStatus, currentItem),
    [api, queueSetTxStatus]
  );

  useEffect((): void => {
    const nextItem = txqueue.find(({ status }) => ['queued', 'qr'].includes(status)) || null;
    let currentItem = null;

    // when the next up is an RPC, send it immediately
    if (nextItem && nextItem.status === 'queued' && !(nextItem.extrinsic || nextItem.payload)) {
      _sendRpc(nextItem).catch(console.error);
    } else {
      currentItem = nextItem;
    }

    setCurrentItem(currentItem);
  }, [_sendRpc, txqueue]);

  return (
    <>
      {children}
      {currentItem && (
        <Modal
          className={className}
          currentItem={currentItem}
        />
      )}
    </>
  );
}

export default React.memo(Signer);
