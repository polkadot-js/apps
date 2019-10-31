// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';
import { BareProps } from './types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { AccountName } from '@polkadot/react-query';
import { KeyringItemType } from '@polkadot/ui-keyring/types';

import { classes, toShortAddress } from './util';
import BalanceDisplay from './Balance';
import BondedDisplay from './Bonded';
import IdentityIcon from './IdentityIcon';
import LockedVote from './LockedVote';

interface Props extends BareProps {
  balance?: BN | BN[];
  bonded?: BN | BN[];
  children?: React.ReactNode;
  iconInfo?: React.ReactNode;
  isPadded?: boolean;
  isShort?: boolean;
  type?: KeyringItemType;
  value?: AccountId | AccountIndex | Address | string;
  withAddress?: boolean;
  withBalance?: boolean;
  withBonded?: boolean;
  withLockedVote?: boolean;
  withName?: boolean;
}

function AddressMini ({ balance, bonded, children, className, iconInfo, isPadded = true, style, value, withAddress = true, withBalance = false, withBonded = false, withLockedVote = false, withName = true }: Props): React.ReactElement<Props> | null {
  if (!value) {
    return null;
  }

  return (
    <div
      className={classes('ui--AddressMini', isPadded ? 'padded' : '', className)}
      style={style}
    >
      <div className='ui--AddressMini-info'>
        {withAddress && (
          <div className='ui--AddressMini-address'>
            {withName
              ? <AccountName params={value} />
              : toShortAddress(value)
            }
          </div>
        )}
        {children}
      </div>
      <div className='ui--AddressMini-icon'>
        <IdentityIcon
          size={24}
          value={value}
        />
        {iconInfo && (
          <div className='ui--AddressMini-icon-info'>
            {iconInfo}
          </div>
        )}
      </div>
      <div className='ui--AddressMini-balances'>
        {withBalance && (
          <BalanceDisplay
            balance={balance}
            params={value}
          />
        )}
        {withBonded && (
          <BondedDisplay
            bonded={bonded}
            label=''
            params={value}
          />
        )}
        {withLockedVote && (
          <LockedVote params={value} />
        )}
      </div>
    </div>
  );
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
    font-family: monospace;
    max-width: 9rem;
    min-width: 9em;
    overflow: hidden;
    text-align: right;
    text-overflow: ellipsis;
  }

  .ui--AddressMini-balances {
    display: grid;

    .ui--Bonded,
    .ui--LockedVote {
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
