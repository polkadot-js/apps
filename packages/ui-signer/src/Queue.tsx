// Copyright 2017-2018 @polkadot/ui-signer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-react-rx/types';
import { QueueProps, QueueTx, QueueTx$Extrinsic, QueueTx$Base, QueueTx$Id, QueueTx$Status } from './types';

import React from 'react';
import rpcs from '@polkadot/jsonrpc';
import withApi from '@polkadot/ui-react-rx/with/api';
import encode from '@polkadot/extrinsics/codec/encode/extrinsic';
import isUndefined from '@polkadot/util/is/undefined';

import { QueueProvider } from './Context';

const rpc = rpcs.author.public.submitExtrinsic;

export type Props = BareProps & ApiProps & {
  children: any // node?
};

type State = QueueProps;

const defaultState = {
  queue: [] as Array<QueueTx>
} as QueueProps;

let nextId: QueueTx$Id = 0;

class Queue extends React.Component<Props, State> {
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

  queueAdd = (value: QueueTx$Base): QueueTx$Id => {
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

  queueExtrinsic = ({ extrinsic, nonce, publicKey, values }: QueueTx$Extrinsic): QueueTx$Id => {
    const { apiSupport } = this.props;
    const params = Object.values(extrinsic.params);
    const isValid = values.length === params.length &&
      params.reduce((isValid, param, index) =>
        isValid && !isUndefined(values[index]),
        true
      );
    const encoded = isValid && extrinsic.params
      ? encode(extrinsic, values, apiSupport)
      : new Uint8Array([]);

    return this.queueAdd({
      isValid,
      nonce,
      publicKey,
      rpc,
      values: [encoded]
    });
  }
}

export default withApi(Queue);
