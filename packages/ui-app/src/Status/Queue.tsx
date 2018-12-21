// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { RpcMethod } from '@polkadot/jsonrpc/types';
import { BareProps } from '../types';
import { ActionStatus, PartialQueueTx$Extrinsic, PartialQueueTx$Rpc, QueueProps, QueueStatus, QueueTx, QueueTx$Extrinsic, QueueTx$Rpc, QueueTx$Status } from './types';

import BN from 'bn.js';
import React from 'react';
import jsonrpc from '@polkadot/jsonrpc';

import { QueueProvider } from './Context';

export type Props = BareProps & {
  children: React.ReactNode
};

type State = QueueProps;

const defaultState = {
  stqueue: [] as Array<QueueStatus>,
  txqueue: [] as Array<QueueTx>
} as QueueProps;

let nextId = 0;

const REMOVE_TIMEOUT = 7500;
const SUBMIT_RPC = jsonrpc.author.methods.submitAndWatchExtrinsic;
const STATUS_COMPLETE: Array<QueueTx$Status> = [
  // status from subscription
  'finalised', 'usurped', 'dropped', 'invalid',
  // normal completion
  'cancelled', 'error', 'sent'
];

export default class Queue extends React.Component<Props, State> {
  state: State = defaultState;

  constructor (props: Props) {
    super(props);

    this.state = {
      stqueue: [],
      txqueue: [],
      queueAction: this.queueAction,
      queueRpc: this.queueRpc,
      queueExtrinsic: this.queueExtrinsic,
      queueSetTxStatus: this.queueSetTxStatus,
      queueUnclog: this.queueUnclog
    };
  }

  render () {
    return (
      <QueueProvider value={this.state}>
        {this.props.children}
      </QueueProvider>
    );
  }

  private isDuplicateNonce = (value: QueueTx$Extrinsic | QueueTx$Rpc | QueueTx): boolean => {
    const { txqueue } = this.state;

    return txqueue.filter((item) =>
      !STATUS_COMPLETE.includes(item.status) &&
      item.status !== 'completed' &&
      item.accountNonce.eq(value.accountNonce) &&
      item.accountId === value.accountId
    ).length > 0;
  }

  queueAction = (status: ActionStatus): number => {
    const id = ++nextId;

    this.setState(
      (prevState: State): State => ({
        stqueue: prevState.stqueue.concat({
          ...status,
          id,
          isCompleted: false
        })
      } as State)
    );

    setTimeout(() => {
      this.setState(
        (prevState: State): State => ({
          stqueue: prevState.stqueue.map((item) => ({
            ...item,
            isCompleted: item.isCompleted || item.id === id
          }))
        } as State)
      );
    }, REMOVE_TIMEOUT);

    return id;
  }

  queueSetTxStatus = (id: number, status: QueueTx$Status, result?: any, error?: Error): void => {
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

    if (STATUS_COMPLETE.includes(status)) {
      setTimeout(() => {
        this.queueSetTxStatus(id, 'completed');
      }, REMOVE_TIMEOUT);
    }
  }

  private queueAdd = (value: QueueTx$Extrinsic | QueueTx$Rpc | QueueTx): number => {
    const id = ++nextId;
    const rpc: RpcMethod = (value as QueueTx$Rpc).rpc || SUBMIT_RPC;

    this.setState(
      (prevState: State): State => ({
        txqueue: prevState.txqueue.concat([{
          ...value,
          id,
          rpc,
          status: this.isDuplicateNonce(value) ? 'blocked' : 'queued'
        }])
      } as State)
    );

    return id;
  }

  queueExtrinsic = ({ accountId, accountNonce, extrinsic }: PartialQueueTx$Extrinsic): number => {
    return this.queueAdd({
      accountId,
      accountNonce: accountNonce || new BN(0),
      extrinsic
    });
  }

  queueRpc = ({ accountId, accountNonce, rpc, values }: PartialQueueTx$Rpc): number => {
    return this.queueAdd({
      accountId,
      accountNonce: accountNonce || new BN(0),
      rpc,
      values
    });
  }

  queueUnclog = (accountNonce: BN): void => {
    const { txqueue } = this.state;

    // FIXME It works, but it's gross. It cancels all queued extrinsic with the nonincremenated
    // nonce marked with a 'blocked' status and then requeues them all with the updated nonce.
    // Unless users spam submit extrinsics, i can't see this being an issue, but it is still ugly.
    txqueue.forEach((item) => {
      if (item.status === 'blocked') {
        let updatedItem = item;
        this.queueSetTxStatus(item.id, 'cancelled');

        updatedItem.accountNonce = accountNonce;
        this.queueAdd(updatedItem);
      }
    });
  }
}
