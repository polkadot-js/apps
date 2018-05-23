// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-app/types';
import type { QueueProps } from '@polkadot/ui-signer/types';

import './index.css';

import React from 'react';

import classes from '@polkadot/ui-app/util/classes';
import Signer from '@polkadot/ui-signer';

import Results from './Results';
import Selection from './Selection';

type Props = I18nProps & {};

export default function RpcApp ({ className, style }: Props): React$Node {
  return (
    <div
      className={classes('rpc--App', className)}
      style={style}
    >
      <Signer.Queue.Consumer>
        {({ queue, queueAdd }: QueueProps = {}) => [
          <Selection
            key='add'
            queueAdd={queueAdd}
          />,
          <Results
            key='results'
            queue={queue}
          />
        ]}
      </Signer.Queue.Consumer>
    </div>
  );
}
