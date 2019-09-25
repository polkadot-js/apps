// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SignerPayloadJSON } from '@polkadot/types/types';
import { BareProps } from '../types';
import { ActionStatus, PartialQueueTxExtrinsic, PartialQueueTxRpc, QueueStatus, QueueTx, QueueTxExtrinsic, QueueTxRpc, QueueTxStatus, SignerCallback } from './types';

import React, { useRef, useState } from 'react';
import jsonrpc from '@polkadot/jsonrpc';
import { createType } from '@polkadot/types';

import { QueueProvider } from './Context';
import { SubmittableResult } from '@polkadot/api';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';

export interface Props extends BareProps {
  children: React.ReactNode;
}

let nextId = 0;

const REMOVE_TIMEOUT = 7500;
const SUBMIT_RPC = jsonrpc.author.methods.submitAndWatchExtrinsic;
const STATUS_COMPLETE: QueueTxStatus[] = [
  // status from subscription
  'finalized', 'usurped', 'dropped', 'invalid',
  // normal completion
  'cancelled', 'error', 'sent'
];

export default function Queue ({ children }: Props): React.ReactElement<Props> {
  const [stqueue, setStQueue] = useState<QueueStatus[]>([]);
  const [txqueue, setTxQueue] = useState<QueueTx[]>([]);

  const _clearTxStatus = useRef(
    (id: number): () => void =>
      (): void => setTxQueue([...txqueue.map((item): QueueTx =>
        item.id === id
          ? { ...item, status: 'completed' }
          : item
      )])
  );
  const _addToTxQueue = useRef(
    (value: QueueTxExtrinsic | QueueTxRpc | QueueTx): number => {
      const id = ++nextId;

      setTxQueue([...txqueue, {
        ...value,
        id,
        removeItem: _clearTxStatus.current(id),
        rpc: (value as QueueTxRpc).rpc || SUBMIT_RPC,
        status: 'queued'
      }]);

      return id;
    }
  );
  const queueAction = useRef(
    (status: ActionStatus | ActionStatus[]): number => {
      const todos = (Array.isArray(status) ? status : [status]).map((item: ActionStatus) => {
        const id = ++nextId;
        const removeItem = (): void =>
          setStQueue([...stqueue.filter((item): boolean => item.id !== id)]);

        setTimeout(removeItem, REMOVE_TIMEOUT);

        return {
          ...item,
          id,
          isCompleted: false,
          removeItem
        };
      });

      setStQueue([...stqueue, ...todos]);

      return todos[0].id;
    }
  );
  const queueExtrinsic = useRef(
    ({ accountId, extrinsic, txFailedCb, txSuccessCb, txStartCb, txUpdateCb, isUnsigned }: PartialQueueTxExtrinsic): number =>
      _addToTxQueue.current({
        accountId,
        extrinsic,
        isUnsigned,
        txFailedCb,
        txSuccessCb,
        txStartCb,
        txUpdateCb
      })
  );
  const queuePayload = useRef(
    (payload: SignerPayloadJSON, signerCb: SignerCallback): number =>
      _addToTxQueue.current({
        accountId: payload.address,
        // this is not great, but the Extrinsic we don't need a submittable
        extrinsic: createType('Extrinsic',
          { method: createType('Call', payload.method) },
          { version: payload.version }
        ) as unknown as SubmittableExtrinsic,
        payload,
        signerCb
      })
  );
  const queueRpc = useRef(
    ({ accountId, rpc, values }: PartialQueueTxRpc): number =>
      _addToTxQueue.current({
        accountId,
        rpc,
        values
      })
  );
  const queueSetTxStatus = useRef(
    (id: number, status: QueueTxStatus, result?: SubmittableResult, error?: Error): void => {
      setTxQueue([...txqueue.map((item): QueueTx =>
        item.id === id
          ? {
            ...item,
            error: error === undefined
              ? item.error
              : error,
            result: result === undefined
              ? item.result
              : result,
            status: item.status === 'completed'
              ? item.status
              : status
          }
          : item
      )]);

      queueAction.current(
        ((result && result.events) || [])
          // filter events handled globally, or those we are not interested in, these are
          // handled by the global overview, so don't add them here
          .filter((record): boolean => !!record.event && record.event.section !== 'democracy')
          .map(({ event: { method, section } }): ActionStatus => ({
            action: `${section}.${method}`,
            status: section === 'system' && method === 'ExtrinsicFailed'
              ? 'error'
              : 'event',
            message: 'extrinsic event'
          }))
      );

      if (STATUS_COMPLETE.includes(status)) {
        setTimeout(_clearTxStatus.current(id), REMOVE_TIMEOUT);
      }
    }
  );

  return (
    <QueueProvider value={{
      queueAction: queueAction.current,
      queueExtrinsic: queueExtrinsic.current,
      queuePayload: queuePayload.current,
      queueRpc: queueRpc.current,
      queueSetTxStatus: queueSetTxStatus.current,
      stqueue,
      txqueue
    }}>
      {children}
    </QueueProvider>
  );
}
