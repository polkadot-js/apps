// Copyright 2017-2018 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';
import { PartialQueueTx$Extrinsic, PartialQueueTx$Rpc, QueueProps, QueueTx, QueueTx$Extrinsic, QueueTx$Rpc, QueueTx$Id, QueueTx$Status } from './types';

import BN from 'bn.js';
import React from 'react';
import jsonrpc from '@polkadot/jsonrpc';

import { QueueProvider } from './Context';
import { RpcMethod } from '@polkadot/jsonrpc/types';

export type Props = BareProps & {
  children: React.ReactNode
};

type State = QueueProps;

const defaultState = {
  queue: [] as Array<QueueTx>
} as QueueProps;

let nextId: QueueTx$Id = 0;

const REMOVE_TIMEOUT = 5000;
const SUBMIT_RPC = jsonrpc.author.methods.submitAndWatchExtrinsic;
const STATUS_COMPLETE: Array<QueueTx$Status> = [
  // status from subscription
  'finalised', 'usurped', 'dropped',
  // normal completion
  'cancelled', 'error', 'sent'
];

export default class Queue extends React.Component<Props, State> {
  state: State = defaultState;

  constructor (props: Props) {
    super(props);

    this.state = {
      queue: [],
      queueRpc: this.queueRpc,
      queueExtrinsic: this.queueExtrinsic,
      queueSetStatus: this.queueSetStatus
    };
  }

  render () {
    return (
      <QueueProvider value={this.state}>
        {this.props.children}
      </QueueProvider>
    );
  }

  queueSetStatus = (id: QueueTx$Id, status: QueueTx$Status, result?: any, error?: Error): void => {
    this.setState(
      (prevState: State): State => ({
        queue: prevState.queue.map((item) =>
          item.id === id
            ? {
              ...item,
              error: error === undefined
                ? item.error
                : error,
              result: result === undefined
                ? item.result
                : result,
              status
            }
            : item
        )
      } as State)
    );

    if (STATUS_COMPLETE.includes(status)) {
      setTimeout(() => {
        this.queueSetStatus(id, 'completed');
      }, REMOVE_TIMEOUT);
    }
  }

  private queueAdd = (value: QueueTx$Extrinsic | QueueTx$Rpc): QueueTx$Id => {
    const id: QueueTx$Id = ++nextId;
    const rpc: RpcMethod = (value as QueueTx$Rpc).rpc || SUBMIT_RPC;

    this.setState(
      (prevState: State): State => ({
        queue: prevState.queue.concat([{
          ...value,
          id,
          rpc,
          status: 'queued'
        }])
      } as State)
    );

    return id;
  }

  queueExtrinsic = ({ accountId, accountNonce, extrinsic }: PartialQueueTx$Extrinsic): QueueTx$Id => {
    return this.queueAdd({
      accountId,
      accountNonce: accountNonce || new BN(0),
      extrinsic
    });
  }

  queueRpc = ({ accountId, accountNonce, rpc, values }: PartialQueueTx$Rpc): QueueTx$Id => {
    return this.queueAdd({
      accountId,
      accountNonce: accountNonce || new BN(0),
      rpc,
      values
    });
  }
}
