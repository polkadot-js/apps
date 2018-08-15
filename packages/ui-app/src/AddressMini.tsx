// Copyright 2017-2018 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import IdentityIcon from '@polkadot/ui-react/IdentityIcon';

import classes from './util/classes';
import toShortAddress from './util/toShortAddress';
import Balance from './Balance';

type Props = BareProps & {
  balance?: BN | Array<BN>,
  isPadded?: boolean,
  isShort?: boolean,
  value?: string,
  withBalance?: boolean
};

export default class AddressMini extends React.PureComponent<Props> {
  render () {
    const { className, isPadded = true, isShort = true, style, value } = this.props;

    if (!value) {
      return null;
    }

    return (
      <div
        className={classes('ui--AddressMini', isPadded ? 'padded' : '', className)}
        style={style}
      >
        <div className='ui--AddressMini-info'>
          <IdentityIcon
            size={24}
            value={value}
          />
          <div>{isShort ? toShortAddress(value) : value}</div>
        </div>
        {this.renderBalance()}
      </div>
    );
  }

  private renderBalance () {
    const { balance, value, withBalance = false } = this.props;

    if (!withBalance || !value) {
      return null;
    }

    return (
      <Balance
        balance={balance}
        className='ui--AddressSummary-balance'
        value={value}
      />
    );
  }
}
