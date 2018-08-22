// Copyright 2017-2018 @polkadot/app-extrinsics authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';
import { QueueProps } from '@polkadot/ui-signer/types';

import './index.css';

import React from 'react';
import { QueueConsumer } from '@polkadot/ui-signer/Context';

import Selection from './Selection';

type Props = BareProps & {
  basePath: string
};

export default class ExtrinsicsApp extends React.PureComponent<Props> {
  render () {
    return (
      <main className='extrinsics--App'>
        <QueueConsumer>
          {({ queueAdd }: QueueProps) => (
            <Selection queueAdd={queueAdd} />
          )}
        </QueueConsumer>
      </main>
    );
  }
}
