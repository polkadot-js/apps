// Copyright 2017-2018 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';
import { QueueProps } from '@polkadot/ui-signer/types';

import './index.css';

import React from 'react';

import classes from '@polkadot/ui-app/util/classes';
import { QueueConsumer } from '@polkadot/ui-signer/Context';

import Selection from './Selection';

type Props = BareProps;

export default class ExtrinsicsApp extends React.PureComponent<Props> {
  render () {
    const { className, style } = this.props;

    return (
      <div
        className={classes('extrinsics--App', className)}
        style={style}
      >
        <QueueConsumer>
          {({ queueAdd }: QueueProps) => (
            <Selection queueAdd={queueAdd} />
          )}
        </QueueConsumer>
      </div>
    );
  }
}
