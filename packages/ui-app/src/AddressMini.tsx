// Copyright 2017-2018 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';

import BN from 'bn.js';
import React from 'react';
import { AccountId, AccountIndex, Address, Balance } from '@polkadot/types';
import IdentityIcon from '@polkadot/ui-react/IdentityIcon';
import { withMulti, withObservable } from '@polkadot/ui-react-rx/with/index';

import classes from './util/classes';
import toShortAddress from './util/toShortAddress';
import BalanceDisplay from './Balance';

type Props = BareProps & {
  balance?: Balance | Array<Balance> | BN,
  children?: React.ReactNode,
  isPadded?: boolean,
  isShort?: boolean,
  sessionValidators?: Array<AccountId>,
  value?: AccountId | AccountIndex | Address | string,
  withBalance?: boolean
};

class AddressMini extends React.PureComponent<Props> {
  render () {
    const { children, className, isPadded = true, isShort = true, sessionValidators = [], style, value } = this.props;

    if (!value) {
      return null;
    }

    const address = value.toString();
    const isValidator = sessionValidators.find((validator) =>
      validator.toString() === address
    );

    return (
      <div
        className={classes('ui--AddressMini', isPadded ? 'padded' : '', className)}
        style={style}
      >
        <div className='ui--AddressMini-info'>
          <IdentityIcon
            isHighlight={!!isValidator}
            size={24}
            value={address}
          />
          <div className='ui--AddressMini-address'>{isShort ? toShortAddress(address) : address}</div>
          {children}
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
      <BalanceDisplay
        balance={balance}
        className='ui--AddressSummary-balance'
        value={value}
      />
    );
  }
}

export default withMulti(
  AddressMini,
  withObservable('sessionValidators')
);
