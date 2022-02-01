// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';
import type { KeyringItemType } from '@polkadot/ui-keyring/types';
import type { BN } from '@polkadot/util';

import React from 'react';
import styled from 'styled-components';

import AccountName from './AccountName';
import BalanceDisplay from './Balance';
import BondedDisplay from './Bonded';
import IdentityIcon from './IdentityIcon';
import LockedVote from './LockedVote';
import { toShortAddress } from './util';

interface Props {
  balance?: BN | BN[];
  bonded?: BN | BN[];
  children?: React.ReactNode;
  className?: string;
  iconInfo?: React.ReactNode;
  isHighlight?: boolean;
  isPadded?: boolean;
  isShort?: boolean;
  label?: React.ReactNode;
  labelBalance?: React.ReactNode;
  nameExtra?: React.ReactNode;
  onNameClick?: () => void;
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

function AddressMini ({ balance, bonded, children, className = '', iconInfo, isHighlight, isPadded = true, label, labelBalance, nameExtra, onNameClick, summary, value, withAddress = true, withBalance = false, withBonded = false, withLockedVote = false, withName = true, withShrink = false, withSidebar = true }: Props): React.ReactElement<Props> | null {
  if (!value) {
    return null;
  }

  return (
    <div className={`ui--AddressMini${isHighlight ? ' isHighlight' : ''}${isPadded ? ' padded' : ''}${withShrink ? ' withShrink' : ''} ${className}`}>
      {label && (
        <label className='ui--AddressMini-label'>{label}</label>
      )}
      <div className='ui--AddressMini-icon'>
        <IdentityIcon value={value} />
        {iconInfo && (
          <div className='ui--AddressMini-icon-info'>
            {iconInfo}
          </div>
        )}
      </div>
      <div className='ui--AddressMini-info'>
        {withAddress && (
          <div
            className='ui--AddressMini-address'
            onClick={onNameClick}
          >
            {withName
              ? (
                <AccountName
                  value={value}
                  withSidebar={withSidebar}
                >
                  {nameExtra}
                </AccountName>
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

  .ui--AddressMini-info {
    max-width: 12rem;
    min-width: 12rem;

    @media only screen and (max-width: 1800px) {
      max-width: 11.5rem;
      min-width: 11.5rem;
    }

    @media only screen and (max-width: 1700px) {
      max-width: 11rem;
      min-width: 11rem;
    }

    @media only screen and (max-width: 1600px) {
      max-width: 10.5rem;
      min-width: 10.5rem;
    }

    @media only screen and (max-width: 1500px) {
      max-width: 10rem;
      min-width: 10rem;
    }

    @media only screen and (max-width: 1400px) {
      max-width: 9.5rem;
      min-width: 9.5rem;
    }

    @media only screen and (max-width: 1300px) {
      max-width: 9rem;
      min-width: 9rem;
    }
  }

  .ui--AddressMini-address {
    overflow: hidden;
    text-align: left;
    text-overflow: ellipsis;
    width: fit-content;
    max-width: inherit;

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
    line-height: 1.2;
    margin-left: 2.25rem;
    margin-top: -0.2rem;
    text-align: left;
  }
`);
