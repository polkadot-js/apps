// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RpcMethod } from '@polkadot/jsonrpc/types';
import { BareProps } from '../types';
import { ActionStatus, PartialQueueTxExtrinsic, PartialQueueTxRpc, QueueProps, QueueStatus, QueueTx, QueueTxExtrinsic, QueueTxRpc, QueueTxStatus } from './types';

import React from 'react';
import jsonrpc from '@polkadot/jsonrpc';

import { QueueProvider } from './Context';
import { SubmittableResult } from '@polkadot/api/SubmittableExtrinsic';

export interface Props extends BareProps {
  children: React.ReactNode;
}

type State = QueueProps;

const defaultState = {
  stqueue: [] as QueueStatus[],
  txqueue: [] as QueueTx[]
} as QueueProps;

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
  public state: State = defaultState;

  public constructor (props: Props) {
    super(props);

    this.state = {
      stqueue: [],
      txqueue: [],
      queueAction: this.queueAction,
      queueRpc: this.queueRpc,
      queueExtrinsic: this.queueExtrinsic,
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
        (prevState: State): State => ({
          stqueue: prevState.stqueue.filter((item) => item.id !== id)
        } as State)
      );
    };
  }

  queueAction = (status: ActionStatus): number => {
    const id = ++nextId;
    const removeItem = this.clearAction(id);

    this.setState(
      (prevState: State): State => ({
        stqueue: prevState.stqueue.concat({
          ...status,
          id,
          isCompleted: false,
          removeItem
        })
      } as State)
    );

    setTimeout(removeItem, REMOVE_TIMEOUT);

    return id;
  }

  private clearStatus (id: number): () => void {
    return () => {
      this.setState(
        (prevState: State): State => ({
          txqueue: prevState.txqueue.map((item) =>
            item.id === id
              ? { ...item, status: 'completed' }
              : item
          )
        } as State)
      );
    };
  }

  queueSetTxStatus = (id: number, status: QueueTxStatus, result?: SubmittableResult, error?: Error): void => {
    this.setState(
      (prevState: State): State => ({
        txqueue: prevState.txqueue.map((item) =>
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
      } as State)
    );

    this.addResultEvents(result);

    if (STATUS_COMPLETE.includes(status)) {
      setTimeout(this.clearStatus(id), REMOVE_TIMEOUT);
    }
  }

  private addResultEvents ({ events = [] }: Partial<SubmittableResult> = {}) {
    events.filter((record) => record.event).forEach(({ event: { method, section } }) => {
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
      (prevState: State): State => ({
        txqueue: prevState.txqueue.concat([{
          ...value,
          id,
          removeItem,
          rpc,
          status: 'queued'
        }])
      } as State)
    );

    return id;
  }

  queueExtrinsic = ({ accountId, extrinsic, signerCb, signerOptions, txFailedCb, txSuccessCb, txStartCb, txUpdateCb, isUnsigned }: PartialQueueTxExtrinsic): number => {
    return this.queueAdd({
      accountId,
      extrinsic,
      isUnsigned,
      signerCb,
      signerOptions,
      txFailedCb,
      txSuccessCb,
      txStartCb,
      txUpdateCb
    });
  }

  queueRpc = ({ accountId, rpc, values }: PartialQueueTxRpc): number => {
    return this.queueAdd({
      accountId,
      rpc,
      values
    });
  }
}
