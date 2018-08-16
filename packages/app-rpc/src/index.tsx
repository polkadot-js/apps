// Copyright 2017-2018 @polkadot/app-rpc authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';
import { QueueProps } from '@polkadot/ui-signer/types';

import './index.css';

import React from 'react';
import Page from '@polkadot/ui-app/Page';
import classes from '@polkadot/ui-app/util/classes';
import { QueueConsumer } from '@polkadot/ui-signer/Context';

import Results from './Results';
import Selection from './Selection';

type Props = BareProps & {
  basePath: string
};

export default class RpcApp extends React.PureComponent<Props> {
  render () {
    const { className, style } = this.props;

    return (
      <Page
        className={classes('rpc--App', className)}
        style={style}
      >
        <QueueConsumer>
          {({ queue, queueAdd }: QueueProps) => [
            <Selection
              key='add'
              queueAdd={queueAdd}
            />,
            <Results
              key='results'
              queue={queue}
            />
          ]}
        </QueueConsumer>
      </Page>
    );
  }
}
