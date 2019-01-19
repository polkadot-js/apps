// Copyright 2017-2019 @polkadot/app-rpc authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, BareProps } from '@polkadot/ui-app/types';
import { QueueProps } from '@polkadot/ui-app/Status/types';

import './index.css';

import React from 'react';
import { QueueConsumer } from '@polkadot/ui-app/Status/Context';

import Results from './Results';
import Selection from './Selection';

type Props = AppProps & BareProps;

export default class RpcApp extends React.PureComponent<Props> {
  render () {
    return (
      <main className='rpc--App'>
        <QueueConsumer>
          {({ txqueue, queueRpc }: QueueProps) => [
            <Selection
              key='add'
              queueRpc={queueRpc}
            />,
            <Results
              key='results'
              queue={txqueue}
            />
          ]}
        </QueueConsumer>
      </main>
    );
  }
}
