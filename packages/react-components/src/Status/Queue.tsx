// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SubmittableExtrinsic } from '@polkadot/api/promise/types';
import type { Bytes } from '@polkadot/types';
import type { DispatchError } from '@polkadot/types/interfaces';
import type { ITuple, Registry, SignerPayloadJSON } from '@polkadot/types/types';
import type { ActionStatus, ActionStatusPartial, PartialQueueTxExtrinsic, PartialQueueTxRpc, QueueStatus, QueueTx, QueueTxExtrinsic, QueueTxRpc, QueueTxStatus, SignerCallback } from './types';

import React, { useCallback, useRef, useState } from 'react';

import { SubmittableResult } from '@polkadot/api';
import jsonrpc from '@polkadot/types/interfaces/jsonrpc';

import { getContractAbi } from '../util';
import { STATUS_COMPLETE } from './constants';
import { QueueProvider } from './Context';

export interface Props {
  children: React.ReactNode;
}

interface StatusCount {
  count: number;
  status: ActionStatusPartial;
}

let nextId = 0;

const EVENT_MESSAGE = 'extrinsic event';
const REMOVE_TIMEOUT = 7500;
const SUBMIT_RPC = jsonrpc.author.submitAndWatchExtrinsic;

function mergeStatus (status: ActionStatusPartial[]): ActionStatus[] {
  let others: ActionStatus | null = null;

  const initial = status
    .reduce((result: StatusCount[], status): StatusCount[] => {
      const prev = result.find(({ status: prev }) => prev.action === status.action && prev.status === status.status);

      if (prev) {
        prev.count++;
      } else {
        result.push({ count: 1, status });
      }

      return result;
    }, [])
    .map(({ count, status }): ActionStatusPartial =>
      count === 1
        ? status
        : { ...status, action: `${status.action} (x${count})` }
    )
    .filter((status): boolean => {
      if (status.message !== EVENT_MESSAGE) {
        return true;
      }

      if (others) {
        if (status.action.startsWith('system.ExtrinsicSuccess')) {
          (others.action as string[]).unshift(status.action);
        } else {
          (others.action as string[]).push(status.action);
        }
      } else {
        others = {
          ...status,
          action: [status.action]
        };
      }

      return false;
    });

  return others
    ? initial.concat(others)
    : initial;
}

function extractEvents (result?: SubmittableResult): ActionStatus[] {
  return mergeStatus(
    ((result && result.events) || [])
      // filter events handled globally, or those we are not interested in, these are
      // handled by the global overview, so don't add them here
      .filter((record): boolean => !!record.event && record.event.section !== 'democracy')
      .map(({ event: { data, method, section } }): ActionStatusPartial => {
        if (section === 'system' && method === 'ExtrinsicFailed') {
          const [dispatchError] = data as unknown as ITuple<[DispatchError]>;
          let message = dispatchError.type;

          if (dispatchError.isModule) {
            try {
              const mod = dispatchError.asModule;
              const error = dispatchError.registry.findMetaError(mod);

              message = `${error.section}.${error.name}` as unknown as 'Other';
            } catch (error) {
              // swallow
            }
          } else if (dispatchError.isToken) {
            message = `${dispatchError.type}.${dispatchError.asToken.type}` as unknown as 'Other';
          }

          return {
            action: `${section}.${method}`,
            message,
            status: 'error'
          };
        } else if (section === 'contracts') {
          if (method === 'ContractExecution' && data.length === 2) {
            // see if we have info for this contract
            const [accountId, encoded] = data;

            try {
              const abi = getContractAbi(accountId.toString());

              if (abi) {
                const decoded = abi.decodeEvent(encoded as Bytes);

                return {
                  action: decoded.event.identifier,
                  message: 'contract event',
                  status: 'event'
                };
              }
            } catch (error) {
              // ABI mismatch?
              console.error(error);
            }
          } else if (method === 'Evicted') {
            return {
              action: `${section}.${method}`,
              message: 'contract evicted',
              status: 'error'
            };
          }
        }

        return {
          action: `${section}.${method}`,
          message: EVENT_MESSAGE,
          status: 'event'
        };
      })
  );
}

function Queue ({ children }: Props): React.ReactElement<Props> {
  const [stqueue, _setStQueue] = useState<QueueStatus[]>([]);
  const [txqueue, _setTxQueue] = useState<QueueTx[]>([]);
  const stRef = useRef(stqueue);
  const txRef = useRef(txqueue);

  const setStQueue = useCallback(
    (st: QueueStatus[]): void => {
      stRef.current = st;
      _setStQueue(st);
    },
    []
  );

  const setTxQueue = useCallback(
    (tx: QueueTx[]): void => {
      txRef.current = tx;
      _setTxQueue(tx);
    },
    []
  );

  const addToTxQueue = useCallback(
    (value: QueueTxExtrinsic | QueueTxRpc | QueueTx): void => {
      const id = ++nextId;
      const removeItem = () => setTxQueue([
        ...txRef.current.map((item): QueueTx =>
          item.id === id
            ? { ...item, status: 'completed' }
            : item
        )
      ]);

      setTxQueue([...txRef.current, {
        ...value,
        id,
        removeItem,
        rpc: (value as QueueTxRpc).rpc || SUBMIT_RPC,
        status: 'queued'
      }]);
    },
    [setTxQueue]
  );

  const queueAction = useCallback(
    (_status: ActionStatus | ActionStatus[]): void => {
      const status = Array.isArray(_status) ? _status : [_status];

      status.length && setStQueue([
        ...stRef.current,
        ...(status.map((item): QueueStatus => {
          const id = ++nextId;
          const removeItem = (): void =>
            setStQueue([...stRef.current.filter((item): boolean => item.id !== id)]);

          setTimeout(removeItem, REMOVE_TIMEOUT);

          return {
            ...item,
            id,
            isCompleted: false,
            removeItem
          };
        }))
      ]);
    },
    [setStQueue]
  );

  const queueExtrinsic = useCallback(
    (value: PartialQueueTxExtrinsic) => addToTxQueue({ ...value }),
    [addToTxQueue]
  );

  const queuePayload = useCallback(
    (registry: Registry, payload: SignerPayloadJSON, signerCb: SignerCallback): void => {
      addToTxQueue({
        accountId: payload.address,
        // this is not great, but the Extrinsic doesn't need a submittable
        extrinsic: registry.createType('Extrinsic',
          { method: registry.createType('Call', payload.method) },
          { version: payload.version }
        ) as unknown as SubmittableExtrinsic,
        payload,
        signerCb
      });
    },
    [addToTxQueue]
  );

  const queueRpc = useCallback(
    (value: PartialQueueTxRpc) => addToTxQueue({ ...value }),
    [addToTxQueue]
  );

  const queueSetTxStatus = useCallback(
    (id: number, status: QueueTxStatus, result?: SubmittableResult, error?: Error): void => {
      setTxQueue([
        ...txRef.current.map((item): QueueTx =>
          item.id === id
            ? {
              ...item,
              error: error === undefined
                ? item.error
                : error,
              result: result === undefined
                ? item.result as SubmittableResult
                : result,
              status: item.status === 'completed'
                ? item.status
                : status
            }
            : item
        )
      ]);

      queueAction(extractEvents(result));

      if (STATUS_COMPLETE.includes(status)) {
        setTimeout((): void => {
          const item = txRef.current.find((item): boolean => item.id === id);

          item && item.removeItem();
        }, REMOVE_TIMEOUT);
      }
    },
    [queueAction, setTxQueue]
  );

  return (
    <QueueProvider
      value={{
        queueAction,
        queueExtrinsic,
        queuePayload,
        queueRpc,
        queueSetTxStatus,
        stqueue,
        txqueue
      }}
    >
      {children}
    </QueueProvider>
  );
}

export default React.memo(Queue);
