// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RpcMethod } from '@polkadot/jsonrpc/types';
import { SignerPayloadJSON } from '@polkadot/types/types';
import { BareProps } from '../types';
import { ActionStatus, PartialQueueTxExtrinsic, PartialQueueTxRpc, QueueProps as State, QueueStatus, QueueTx, QueueTxExtrinsic, QueueTxRpc, QueueTxStatus, SignerCallback } from './types';

import React from 'react';
import jsonrpc from '@polkadot/jsonrpc';
import { createType } from '@polkadot/types';

import { QueueProvider } from './Context';
import { SubmittableResult } from '@polkadot/api';
import { SubmittableExtrinsic } from '@polkadot/api/promise/types';

export interface Props extends BareProps {
  children: React.ReactNode;
}

const defaultState: Partial<State> = {
  stqueue: [] as QueueStatus[],
  txqueue: [] as QueueTx[]
};

let nextId = 0;

const REMOVE_TIMEOUT = 7500;
const SUBMIT_RPC = jsonrpc.author.methods.submitAndWatchExtrinsic;
const STATUS_COMPLETE: QueueTxStatus[] = [
  // status from subscription
  'finalized', 'usurped', 'dropped', 'invalid',
  // normal completion
  'cancelled', 'error', 'sent'
];

export default class Queue extends React.Component<Props, State> {
  public state: State = defaultState as State;

  public constructor (props: Props) {
    super(props);

    this.state = {
      stqueue: [],
      txqueue: [],
      queueAction: this.queueAction,
      queueExtrinsic: this.queueExtrinsic,
      queuePayload: this.queuePayload,
      queueRpc: this.queueRpc,
      queueSetTxStatus: this.queueSetTxStatus
    };
  }

  public render (): React.ReactNode {
    return (
      <QueueProvider value={this.state}>
        {this.props.children}
      </QueueProvider>
    );
  }

  private clearAction (id: number): () => void {
    return (): void => {
      this.setState(
        (prevState: State): Pick<State, never> => ({
          stqueue: prevState.stqueue.filter((item): boolean => item.id !== id)
        })
      );
    };
  }

  public queueAction = (status: ActionStatus | ActionStatus[]): number => {
    const todos = (Array.isArray(status) ? status : [status]).map((item: ActionStatus) => {
      const id = ++nextId;
      const removeItem = this.clearAction(id);

      setTimeout(removeItem, REMOVE_TIMEOUT);

      return {
        ...item,
        id,
        isCompleted: false,
        removeItem
      };
    });

    this.setState(
      (prevState: State): Pick<State, never> => ({
        stqueue: prevState.stqueue.concat(...todos)
      })
    );

    return todos[0].id;
  }

  private clearStatus (id: number): () => void {
    return (): void => {
      this.setState(
        (prevState: State): Pick<State, never> => ({
          txqueue: prevState.txqueue.map((item): QueueTx =>
            item.id === id
              ? { ...item, status: 'completed' }
              : item
          )
        })
      );
    };
  }

  private queueSetTxStatus = (id: number, status: QueueTxStatus, result?: SubmittableResult, error?: Error): void => {
    this.setState(
      (prevState: State): Pick<State, never> => ({
        txqueue: prevState.txqueue.map((item): QueueTx =>
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
        )
      })
    );

    this.addResultEvents(result);

    if (STATUS_COMPLETE.includes(status)) {
      setTimeout(this.clearStatus(id), REMOVE_TIMEOUT);
    }
  }

  private addResultEvents ({ events = [] }: Partial<SubmittableResult> = {}): void {
    events.filter((record): boolean => !!record.event).forEach(({ event: { method, section } }): void => {
      // filter events handled globally, or those we are not interested in, these are
      // handled by the global overview, so don't add them here
      if (section === 'democracy') {
        return;
      }

      const status = section === 'system' && method === 'ExtrinsicFailed'
        ? 'error'
        : 'event';

      this.queueAction({
        action: `${section}.${method}`,
        status,
        message: 'extrinsic event'
      });
    });
  }

  private queueAdd = (value: QueueTxExtrinsic | QueueTxRpc | QueueTx): number => {
    const id = ++nextId;
    const rpc: RpcMethod = (value as QueueTxRpc).rpc || SUBMIT_RPC;
    const removeItem = this.clearStatus(id);

    this.setState(
      (prevState: State): Pick<State, never> => ({
        txqueue: prevState.txqueue.concat([{
          ...value,
          id,
          removeItem,
          rpc,
          status: 'queued'
        }])
      })
    );

    return id;
  }

  public queueExtrinsic = ({ accountId, extrinsic, txFailedCb, txSuccessCb, txStartCb, txUpdateCb, isUnsigned }: PartialQueueTxExtrinsic): number => {
    return this.queueAdd({
      accountId,
      extrinsic,
      isUnsigned,
      txFailedCb,
      txSuccessCb,
      txStartCb,
      txUpdateCb
    });
  }

  public queuePayload = (payload: SignerPayloadJSON, signerCb: SignerCallback): number => {
    return this.queueAdd({
      accountId: payload.address,
      // this is not great, but the Extrinsic we don't need a submittable
      extrinsic: createType('Extrinsic',
        { method: createType('Call', payload.method) },
        { version: payload.version }
      ) as unknown as SubmittableExtrinsic,
      payload,
      signerCb
    });
  }

  public queueRpc = ({ accountId, rpc, values }: PartialQueueTxRpc): number => {
    return this.queueAdd({
      accountId,
      rpc,
      values
    });
  }
}
