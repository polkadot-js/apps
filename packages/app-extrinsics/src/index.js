// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from '@polkadot/ui-app/types';
import type { QueueProps } from '@polkadot/ui-signer/types';

import './index.css';

import React from 'react';

import classes from '@polkadot/ui-app/util/classes';
import Signer from '@polkadot/ui-signer';

import Selection from './Selection';

type Props = BareProps;

export default function ExtrinsicsApp ({ className, style }: Props): React$Node {
  return (
    <div
      className={classes('extrinsics--App', className)}
      style={style}
    >
      <Signer.Queue.Consumer>
        {({ queueAdd }: QueueProps = {}) => (
          <Selection queueAdd={queueAdd} />
        )}
      </Signer.Queue.Consumer>
    </div>
  );
}
