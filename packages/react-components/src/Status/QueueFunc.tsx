// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SignerPayloadJSON } from '@polkadot/types/types';
import { BareProps } from '../types';
import { ActionStatus, PartialQueueTxExtrinsic, PartialQueueTxRpc, QueueStatus, QueueTx, QueueTxExtrinsic, QueueTxRpc, QueueTxStatus, SignerCallback } from './types';

import React, { useState } from 'react';
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

// FIXME We really need to memo these things - this is not really optimal
export default function Queue ({ children }: Props): React.ReactElement<Props> {
  const [stqueue, setStQueue] = useState<QueueStatus[]>([]);
  const [txqueue, setTxQueue] = useState<QueueTx[]>([]);

  const _clearStatus = (id: number): () => void =>
    (): void => setTxQueue([...txqueue.map((item): QueueTx =>
      item.id === id
        ? { ...item, status: 'completed' }
        : item
    )]);
  const _queueActions = (status: ActionStatus[]): QueueStatus[] =>
    status.map((item: ActionStatus) => {
      const id = ++nextId;
      const removeItem = (): void => setStQueue([...stqueue.filter((item): boolean => item.id !== id)]);

      setTimeout(removeItem, REMOVE_TIMEOUT);

      return {
        ...item,
        id,
        isCompleted: false,
        removeItem
      };
    });
  const queueAction = (status: ActionStatus | ActionStatus[]): number => {
    const todos = _queueActions(Array.isArray(status) ? status : [status]);

    setStQueue([...stqueue, ...todos]);

    return todos[0].id;
  };
  const queueAdd = (value: QueueTxExtrinsic | QueueTxRpc | QueueTx): number => {
    const id = ++nextId;

    setTxQueue([...txqueue, {
      ...value,
      id,
      removeItem: _clearStatus(id),
      rpc: (value as QueueTxRpc).rpc || SUBMIT_RPC,
      status: 'queued'
    }]);

    return id;
  };
  const _addResultEvents = ({ events = [] }: Partial<SubmittableResult> = {}): void => {
    queueAction(
      events
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
  };
  const queueSetTxStatus = (id: number, status: QueueTxStatus, result?: SubmittableResult, error?: Error): void => {
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

    _addResultEvents(result);

    if (STATUS_COMPLETE.includes(status)) {
      setTimeout(_clearStatus(id), REMOVE_TIMEOUT);
    }
  };
  const queueExtrinsic = ({ accountId, extrinsic, txFailedCb, txSuccessCb, txStartCb, txUpdateCb, isUnsigned }: PartialQueueTxExtrinsic): number =>
    queueAdd({
      accountId,
      extrinsic,
      isUnsigned,
      txFailedCb,
      txSuccessCb,
      txStartCb,
      txUpdateCb
    });
  const queuePayload = (payload: SignerPayloadJSON, signerCb: SignerCallback): number =>
    queueAdd({
      accountId: payload.address,
      // this is not great, but the Extrinsic we don't need a submittable
      extrinsic: createType('Extrinsic',
        { method: createType('Call', payload.method) },
        { version: payload.version }
      ) as unknown as SubmittableExtrinsic,
      payload,
      signerCb
    });
  const queueRpc = ({ accountId, rpc, values }: PartialQueueTxRpc): number =>
    queueAdd({
      accountId,
      rpc,
      values
    });

  return (
    <QueueProvider value={{
      queueAction,
      queueExtrinsic,
      queuePayload,
      queueRpc,
      queueSetTxStatus,
      stqueue,
      txqueue
    }}>
      {children}
    </QueueProvider>
  );
}
