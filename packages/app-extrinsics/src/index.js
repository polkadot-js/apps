// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from '@polkadot/ui-react-app/types';
import type { QueueTx, QueueTx$Status } from './types';

import './index.css';

import React from 'react';

import Selection from './Selection';
import Signer from './Signer';
import Status from './Status';

type Props = BareProps & {};

type State = {
  queue: Array<QueueTx>
};

export default class App extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      queue: []
    };
  }

  render (): React$Node {
    const { className, style } = this.props;
    const { queue } = this.state;

    return (
      <div
        className={['extrinsics--App', className].join(' ')}
        style={style}
      >
        <Selection onQueue={this.onQueue} />
        <Signer
          onSetStatus={this.setStatus}
          queue={queue}
        />
        <Status queue={queue} />
      </div>
    );
  }

  setStatus = (id: number, status: QueueTx$Status): void => {
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

  onQueue = (value: QueueTx): void => {
    this.setState(
      (prevState: State): State => ({
        queue: prevState.queue.concat([value])
      })
    );
  }
}
