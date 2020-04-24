// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';
import { BareProps } from './types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { KeyringItemType } from '@polkadot/ui-keyring/types';

import { classes, toShortAddress } from './util';
import AccountName from './AccountName';
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
  label?: React.ReactNode;
  labelBalance?: React.ReactNode;
  noLookup?: boolean;
  summary?: React.ReactNode;
  type?: KeyringItemType;
  value?: AccountId | AccountIndex | Address | string | null | Uint8Array;
  withAddress?: boolean;
  withBalance?: boolean;
  withBonded?: boolean;
  withLockedVote?: boolean;
  withSidebar?: boolean;
  withName?: boolean;
  withShrink?: boolean;
}

function AddressMini ({ balance, bonded, children, className, iconInfo, isPadded = true, label, labelBalance, noLookup, summary, value, withAddress = true, withBalance = false, withBonded = false, withLockedVote = false, withName = true, withShrink = false, withSidebar = true }: Props): React.ReactElement<Props> | null {
  if (!value) {
    return null;
  }

  return (
    <div className={classes('ui--AddressMini', isPadded ? 'padded' : '', withShrink ? 'withShrink' : '', className)}>
      {label && (
        <label className='ui--AddressMini-label'>{label}</label>
      )}
      <div className='ui--AddressMini-icon'>
        <IdentityIcon
          size={24}
          value={value as Uint8Array}
        />
        {iconInfo && (
          <div className='ui--AddressMini-icon-info'>
            {iconInfo}
          </div>
        )}
      </div>
      <div className='ui--AddressMini-info'>
        {withAddress && (
          <div className='ui--AddressMini-address'>
            {withName
              ? (
                <AccountName
                  noLookup={noLookup}
                  value={value}
                  withSidebar={withSidebar}
                />
              )
              : toShortAddress(value)
            }
          </div>
        )}
        {children}
      </div>
      <div className='ui--AddressMini-balances'>
        {withBalance && (
          <BalanceDisplay
            balance={balance}
            label={labelBalance}
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
        {summary && (
          <div className='ui--AddressMini-summary'>{summary}</div>
        )}
      </div>
    </div>
  );
}

export default React.memo(styled(AddressMini)`
  display: inline-block;
  padding: 0 0.25rem 0 1rem;
  text-align: left;
  white-space: nowrap;

  &.padded {
    display: inline-block;
    padding: 0 1rem 0 0;
  }

  &.summary {
    position: relative;
    top: -0.2rem;
  }

  .ui--AddressMini-address {
    max-width: 9rem;
    min-width: 9rem;
    overflow: hidden;
    text-align: left;
    text-overflow: ellipsis;

    > div {
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  &.withShrink {
    .ui--AddressMini-address {
      min-width: 3rem;
    }
  }

  .ui--AddressMini-label {
    margin: 0 0 -0.5rem 2.25rem;
  }

  .ui--AddressMini-balances {
    display: grid;

    .ui--Balance,
    .ui--Bonded,
    .ui--LockedVote {
      font-size: 0.75rem;
      margin-left: 2.25rem;
      margin-top: -0.5rem;
      text-align: left;
    }
  }

  .ui--AddressMini-icon {
    margin: 0 0.5rem 0 0;

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

  .ui--AddressMini-summary {
    font-size: 0.75rem;
    margin-left: 2.25rem;
    margin-top: -0.5rem;
    text-align: left;
  }
`);
