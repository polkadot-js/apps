// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import BN from 'bn.js';
import React from 'react';
import { AccountId, AccountIndex, Address } from '@polkadot/types';
import RxBonded from '@polkadot/ui-reactive/Bonded';

import { classes } from './util';

export type Props = BareProps & {
  bonded?: BN | Array<BN>,
  label?: string,
  address?: AccountId | AccountIndex | Address | string | Uint8Array | null,
  withLabel?: boolean
};

export default class BondedDisplay extends React.PureComponent<Props> {
  render () {
    const { address, className, label, style } = this.props;

    if (!address) {
      return null;
    }

    return (
      <RxBonded
        className={classes('ui--Bonded', className)}
        label={label}
        address={address}
        style={style}
      />
    );
  }
}
