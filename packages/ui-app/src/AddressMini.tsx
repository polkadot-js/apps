// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { AccountId, AccountIndex, Address } from '@polkadot/types';
import { KeyringItemType } from '@polkadot/ui-keyring/types';

import { classes, getAddressName, toShortAddress } from './util';
import BalanceDisplay from './Balance';
import BondedDisplay from './Bonded';
import IdentityIcon from './IdentityIcon';

type Props = BareProps & {
  balance?: BN | Array<BN>,
  bonded?: BN | Array<BN>,
  children?: React.ReactNode,
  iconInfo?: React.ReactNode,
  isPadded?: boolean,
  isShort?: boolean,
  type?: KeyringItemType,
  value?: AccountId | AccountIndex | Address | string,
  withAddress?: boolean,
  withBalance?: boolean,
  withBonded?: boolean
};

class AddressMini extends React.PureComponent<Props> {
  render () {
    const { children, className, iconInfo, isPadded = true, style, value } = this.props;

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
        </div>
        <div className='ui--AddressMini-icon'>
          <IdentityIcon
            size={24}
            value={address}
          />
          {iconInfo && (
            <div className='ui--AddressMini-icon-info'>
              {iconInfo}
            </div>
          )}
        </div>
        <div className='ui--AddressMini-balances'>
          {this.renderBalance()}
          {this.renderBonded()}
        </div>
      </div>
    );
  }

  private renderAddressOrName (address: string) {
    const { isShort = true, withAddress = true, type = 'address' } = this.props;

    if (!withAddress) {
      return null;
    }

    const name = getAddressName(address, type, true);

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

    .ui--Bonded {
      font-size: 0.75rem;
      margin-right: 2.25rem;
      margin-top: -0.5rem;
      text-align: right;
    }
  }

  .ui--AddressMini-icon {
    margin: 0 0 0 0.5rem;

    .ui--AddressMini-icon-info {
      position: absolute;
      right: -0.5rem;
      top: -0.5rem;
      z-index: 1;
    }

    .ui--IdentityIcon {
      margin: 0;
      vertical-align: middle;
    }
  }

  .ui--AddressMini-icon,
  .ui--AddressMini-info {
    display: inline-block;
    position: relative;
    vertical-align: middle;
  }
`;
