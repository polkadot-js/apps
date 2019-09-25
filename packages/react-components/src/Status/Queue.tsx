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

export default function Queue ({ children }: Props): React.ReactElement<Props> {
  const [stqueue, setStQueue] = useState<QueueStatus[]>([]);
  const [txqueue, setTxQueue] = useState<QueueTx[]>([]);

  const addToTxQueue = (setTxQueue: (items: QueueTx[]) => void, value: QueueTxExtrinsic | QueueTxRpc | QueueTx): void => {
    const id = ++nextId;
    const removeItem = (): void =>
      setTxQueue([...txqueue.map((item): QueueTx =>
        item.id === id
          ? { ...item, status: 'completed' }
          : item
      )]);

    setTxQueue([...txqueue, {
      ...value,
      id,
      removeItem,
      rpc: (value as QueueTxRpc).rpc || SUBMIT_RPC,
      status: 'queued'
    }]);
  };

  const queueAction = (status: ActionStatus | ActionStatus[]): void => {
    const _status = Array.isArray(status) ? status : [status];

    if (_status.length) {
      setStQueue([...stqueue, ...(_status.map((item): QueueStatus => {
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
      }))]);
    }
  };
  const queueExtrinsic = ({ accountId, extrinsic, txFailedCb, txSuccessCb, txStartCb, txUpdateCb, isUnsigned }: PartialQueueTxExtrinsic): void =>
    addToTxQueue(setTxQueue, {
      accountId,
      extrinsic,
      isUnsigned,
      txFailedCb,
      txSuccessCb,
      txStartCb,
      txUpdateCb
    });
  const queuePayload = (payload: SignerPayloadJSON, signerCb: SignerCallback): void =>
    addToTxQueue(setTxQueue, {
      accountId: payload.address,
      // this is not great, but the Extrinsic we don't need a submittable
      extrinsic: createType('Extrinsic',
        { method: createType('Call', payload.method) },
        { version: payload.version }
      ) as unknown as SubmittableExtrinsic,
      payload,
      signerCb
    });
  const queueRpc = ({ accountId, rpc, values }: PartialQueueTxRpc): void =>
    addToTxQueue(setTxQueue, {
      accountId,
      rpc,
      values
    });
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

    queueAction(
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
      setTimeout((): void => {
        const item = txqueue.find((item): boolean => item.id === id);

        item && item.removeItem();
      }, REMOVE_TIMEOUT);
    }
  };

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
