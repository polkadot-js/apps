// Copyright 2017-2018 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';
import { QueueProps, QueueTx, QueueTx$Extrinsic, QueueTx$Id, QueueTx$Status } from './types';

import BN from 'bn.js';
import React from 'react';

import { QueueProvider } from './Context';

export type Props = BareProps & {
  children: React.ReactNode
};

type State = QueueProps;

const defaultState = {
  queue: [] as Array<QueueTx>
} as QueueProps;

let nextId: QueueTx$Id = 0;

export default class Queue extends React.Component<Props, State> {
  state: State = defaultState;

  constructor (props: Props) {
    super(props);

    this.state = {
      queue: [],
      queueAdd: this.queueAdd,
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

    if (['cancelled', 'error', 'sent'].includes(status)) {
      setTimeout(() => {
        this.queueSetStatus(id, 'completed');
      }, 5000);
    }
  }

  queueAdd = (value: QueueTx$Extrinsic): QueueTx$Id => {
    const id: QueueTx$Id = ++nextId;

    this.setState(
      (prevState: State): State => ({
        queue: prevState.queue.concat([{
          ...value,
          id,
          status: 'queued'
        }])
      } as State)
    );

    return id;
  }

  queueExtrinsic = ({ extrinsic, accountNonce = new BN(0), publicKey }: QueueTx$Extrinsic): QueueTx$Id => {
    return this.queueAdd({
      accountNonce,
      extrinsic,
      publicKey
    });
  }
}
