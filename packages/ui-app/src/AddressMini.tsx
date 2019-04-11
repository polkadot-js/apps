// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import BN from 'bn.js';
import React from 'react';
import { AccountId, AccountIndex, Address, Balance } from '@polkadot/types';
import { OfflineStatus } from '@polkadot/app-staking/types';
import { RecentlyOffline } from '@polkadot/ui-app';

import { classes, getAddrName, toShortAddress } from './util';
import BalanceDisplay from './Balance';
import BondedDisplay from './Bonded';
import IdentityIcon from './IdentityIcon';

type Props = BareProps & {
  balance?: Balance | Array<Balance> | BN,
  children?: React.ReactNode,
  isPadded?: boolean,
  isShort?: boolean,
  value?: AccountId | AccountIndex | Address | string,
  offlineStatus?: Array<OfflineStatus>,
  withAddress?: boolean,
  withBalance?: boolean,
  withBonded?: boolean
};

export default class AddressMini extends React.PureComponent<Props> {
  render () {
    const { children, className, isPadded = true, style, value } = this.props;

    if (!value) {
      return null;
    }

    const address = value.toString();

    return (
      <div
        className={classes('ui--AddressMini', isPadded ? 'padded' : '', className)}
        style={style}
      >
        <div className='ui--AddressMini-info'>
          <IdentityIcon
            size={24}
            value={address}
          />
          {this.renderAddressOrName(address)}
          {children}
          {this.renderOfflineStatus()}
        </div>
        {this.renderBalance()}
        {this.renderBonded()}
      </div>
    );
  }

  private renderAddressOrName (address: string) {
    const { isShort = true, withAddress = true } = this.props;

    if (!withAddress) {
      return null;
    }

    const name = getAddrName(address);

    console.error('address', address, name);

    return (
      <div className={`ui--AddressMini-address ${name ? 'withName' : 'withAddr'}`}>{
         name || (
          isShort
            ? toShortAddress(address)
            : address
        )
      }</div>
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

  private renderBonded () {
    const { value, withBonded = false } = this.props;

    if (!withBonded || !value) {
      return null;
    }

    return (
      <BondedDisplay
        className='ui--AddressSummary-balance'
        label=''
        value={value}
      />
    );
  }

  private renderOfflineStatus () {
    const { value, offlineStatus } = this.props;

    if (!value || !offlineStatus) {
      return null;
    }

    return (
      <RecentlyOffline
        accountId={value.toString()}
        offline={offlineStatus}
        tooltip
        inline
      />
    );
  }
}
