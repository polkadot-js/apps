// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import BN from 'bn.js';
import React from 'react';
import { AccountId, AccountIndex, Address, Balance } from '@polkadot/types';
import { withCall, withMulti } from '@polkadot/ui-api/index';

import classes from './util/classes';
import toShortAddress from './util/toShortAddress';
import BalanceDisplay from './Balance';
import IdentityIcon from './IdentityIcon';
import { findNameByAddress } from '@polkadot/joy-utils/';

type Props = BareProps & {
  balance?: Balance | Array<Balance> | BN,
  children?: React.ReactNode,
  isPadded?: boolean,
  isShort?: boolean,
  session_validators?: Array<AccountId>,
  value?: AccountId | AccountIndex | Address | string,
  name?: string,
  withAddress?: boolean,
  withBalance?: boolean,
  withName?: boolean
};

class AddressMini extends React.PureComponent<Props> {
  render () {
    const { children, className, isPadded = true, session_validators, style, value } = this.props;

    if (!value) {
      return null;
    }

    const address = value.toString();
    const isValidator = (session_validators || []).find((validator) =>
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
            size={36}
            value={address}
          />
          <div>
            {this.renderAddress(address)}
            <div className='ui--AddressMini-details'>
              {this.renderName(address)}
              {this.renderBalance()}
            </div>
          </div>
          {children}
        </div>
      </div>
    );
  }

  private renderAddress (address: string) {
    const { isShort = true, withAddress = true } = this.props;

    if (!withAddress) {
      return null;
    }

    return (
      <div className='ui--AddressMini-address'>{isShort ? toShortAddress(address) : address}</div>
    );
  }

  private renderName (address: string) {
    let { name, withName = false } = this.props;
    if (!withName) {
      return null;
    }
    name = name ? name : findNameByAddress(address);
    return (
      <div className='ui--AddressSummary-name'>Name: <b style={{ textTransform: 'uppercase' }}>{name}</b></div>
    );
  }

  private renderBalance () {
    const { balance, value, withBalance = false } = this.props;

    if (!withBalance || !value) {
      return null;
    }

    return (
      <BalanceDisplay
        label='Balance: '
        balance={balance}
        className='ui--AddressSummary-balance'
        value={value}
      />
    );
  }
}

export default withMulti(
  AddressMini,
  withCall('query.session.validators')
);
