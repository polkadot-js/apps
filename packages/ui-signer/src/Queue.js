// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from '@polkadot/ui-app/types';
import type { QueueProps, QueueTx$Base, QueueTx$Id } from './types';

import React from 'react';

type Props = BareProps & {
  children: React$Node
};

type State = QueueProps;

const { Consumer, Provider } = React.createContext();
let nextId: QueueTx$Id = 0;

export default class Queue extends React.Component<Props, State> {
  static Provider = Provider;
  static Consumer = Consumer

  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      queue: [],
      queueMessage: this.queueMessage,
      queueSetStatus: this.queueSetStatus
    };
  }

  render () {
    return (
      <Provider value={this.state}>
        {this.props.children}
      </Provider>
    );
  }

  queueSetStatus = (id: QueueTx$Id, status: QueueTx$Status): void => {
    this.setState(
      (prevState: State): State => ({
        queue: prevState.queue.map((item) =>
          item.id === id
            ? { ...item, status }
            : item
        )
      })
    );

    if (['cancelled', 'error', 'sent'].includes(status)) {
      setTimeout(() => this.setStatus(id, 'completed'), 5000);
    }
  }

  queueMessage = (value: QueueTx$Base): QueueTx$Id => {
    const id: QueueTx$Id = ++nextId;

    this.setState(
      (prevState: State): State => ({
        queue: prevState.queue.concat([{
          ...value,
          id,
          status: 'queued'
        }])
      })
    );

    return id;
  }
}
