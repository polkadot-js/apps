// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import BN from 'bn.js';
import React from 'react';
import { AccountId, AccountIndex, Address } from '@polkadot/types';
import { Unlocking } from '@polkadot/ui-reactive';

import { classes } from './util';

export type Props = BareProps & {
  bonded?: BN | Array<BN>,
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null,
  withLabel?: boolean
};

export default class UnlockingDisplay extends React.PureComponent<Props> {
  render () {
    const { params, className, style } = this.props;
    return (
      <Unlocking
        className={classes('ui--Unlocking', className)}
        params={params}
        style={style}
      />
    );
  }
}
