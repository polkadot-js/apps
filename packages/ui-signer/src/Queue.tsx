// Copyright 2017-2018 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';
import { QueueProps, QueueTx, QueueTx$Extrinsic, QueueTx$Id, QueueTx$Rpc, QueueTx$Status } from './types';

import BN from 'bn.js';
import React from 'react';
import jsonrpc from '@polkadot/jsonrpc';

import { QueueProvider } from './Context';

export type Props = BareProps & {
  children: React.ReactNode
};

type State = QueueProps;

const defaultState = {
  queue: [] as Array<QueueTx>
} as QueueProps;

let nextId: QueueTx$Id = 0;

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
      }, 5000);
    }
  }

  queueAdd = (value: QueueTx$Extrinsic | QueueTx$Rpc): QueueTx$Id => {
    if (this.isDuplicateNonce(value)) {
      this.queueSetStatus(nextId, 'error');
      // TODO: Notify user to wait for prev txn to be finalized
      console.error('Give it a second will ya');
      return nextId; // unincremented id from the previous since we short circuit
    }

    const id: QueueTx$Id = ++nextId;

    console.log(`txn ${JSON.stringify(value)} with nonce -> `, value.accountNonce);

    this.setState(
      (prevState: State): State => ({
        queue: prevState.queue.concat([{
          ...value,
          rpc: (value as QueueTx$Rpc).rpc
            ? (value as QueueTx$Rpc).rpc
            : jsonrpc.author.methods.submitAndWatchExtrinsic,
          id,
          status: 'queued'
        }])
      } as State)
    );

    return id;
  }

  queueExtrinsic = ({ extrinsic, accountNonce = new BN(0), accountId }: QueueTx$Extrinsic): QueueTx$Id => {
    return this.queueAdd({
      accountNonce,
      extrinsic,
      accountId
    });
  }

  queueRpc = ({ accountNonce = new BN(0), accountId, rpc, values }: QueueTx$Rpc): QueueTx$Id => {
    return this.queueAdd({
      accountNonce,
      accountId,
      rpc,
      values
    });
  }

  private isDuplicateNonce = (value: QueueTx$Extrinsic | QueueTx$Rpc): boolean => {
    this.state.queue.find((item) => {
      return item.accountNonce === value.accountNonce
    });
  }
}
