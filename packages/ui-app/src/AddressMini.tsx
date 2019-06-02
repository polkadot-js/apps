// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { AccountId, AccountIndex, Address } from '@polkadot/types';
import { OfflineStatus } from '@polkadot/app-staking/types';
import { RecentlyOffline } from '@polkadot/ui-app';

import { classes, getAddrName, toShortAddress } from './util';
import BalanceDisplay from './Balance';
import BondedDisplay from './Bonded';
import IdentityIcon from './IdentityIcon';

type Props = BareProps & {
  balance?: BN | Array<BN>,
  bonded?: BN | Array<BN>,
  children?: React.ReactNode,
  isPadded?: boolean,
  isShort?: boolean,
  value?: AccountId | AccountIndex | Address | string,
  offlineStatus?: Array<OfflineStatus>,
  withAddress?: boolean,
  withBalance?: boolean,
  withBonded?: boolean
};

class AddressMini extends React.PureComponent<Props> {
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
          {this.renderAddressOrName(address)}
          {children}
          {this.renderOfflineStatus()}
        </div>
        <IdentityIcon
          size={24}
          value={address}
        />
        <div className='ui--AddressMini-balances'>
          {this.renderBalance()}
          {this.renderBonded()}
        </div>
      </div>
    );
  }

  private renderAddressOrName (address: string) {
    const { isShort = true, withAddress = true } = this.props;

    if (!withAddress) {
      return null;
    }

    const name = getAddrName(address);

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
        params={value}
      />
    );
  }

  private renderBonded () {
    const { bonded, value, withBonded = false } = this.props;

    if (!withBonded || !value) {
      return null;
    }

    return (
      <BondedDisplay
        bonded={bonded}
        label=''
        params={value}
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

export default styled(AddressMini)`
  display: inline-block;
  padding: 0 0.25rem 0 1rem;
  white-space: nowrap;

  &.padded {
    display: inline-block;
    padding: 0.25rem 0 0 1rem;
  }

  &.summary {
    position: relative;
    top: -0.2rem;
  }

  .ui--AddressMini-address {
    &.withAddr {
      font-family: monospace;
    }

    &.withName {
      text-align: right;
      text-transform: uppercase;
      min-width: 4em;
    }
  }

  .ui--AddressMini-balances {
    display: grid;
  }

  .ui--AddressMini-balances .ui--Bonded.result-bonded,
  .ui--AddressMini-balances .ui--Bonded {
    font-size: .75rem;
    margin-right: 2.25rem;
    margin-top: -.5rem;
    text-align: right;
  }

  .ui--AddressMini-info,
  .ui--IdentityIcon {
    display: inline-block;
    position:relative;
    vertical-align: middle;
  }

  .ui--IdentityIcon {
    margin-left: 0.5rem;
    margin-right: 0;
  }
`;
