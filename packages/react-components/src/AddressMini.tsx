// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, AccountIndex, Address } from '@polkadot/types/interfaces';
import type { KeyringItemType } from '@polkadot/ui-keyring/types';
import type { BN } from '@polkadot/util';

import React from 'react';

import IdentityIcon from './IdentityIcon/index.js';
import AccountName from './AccountName.js';
import BalanceDisplay from './Balance.js';
import BondedDisplay from './Bonded.js';
import LockedVote from './LockedVote.js';
import { styled } from './styled.js';

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
  value?: AccountId | AccountIndex | Address | string | null;
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
    <StyledDiv className={`${className} ui--AddressMini ${isHighlight ? 'isHighlight' : ''} ${isPadded ? 'padded' : ''} ${withShrink ? 'withShrink' : ''}`}>
      {label && (
        <label className='ui--AddressMini-label'>{label}</label>
      )}
      <span className='ui--AddressMini-icon'>
        <IdentityIcon value={value} />
        {iconInfo && (
          <div className='ui--AddressMini-icon-info'>
            {iconInfo}
          </div>
        )}
      </span>
      <span className='ui--AddressMini-info'>
        {withAddress && (
          <span
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
              : <span className='shortAddress'>{value.toString()}</span>
            }
          </span>
        )}
        {children}
      </span>
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
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  overflow-x: hidden;
  padding: 0 0.25rem 0 1rem;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;

  &.padded {
    padding: 0 1rem 0 0;
  }

  &.summary {
    position: relative;
    top: -0.2rem;
  }

  .ui--AddressMini-info {
  }

  .ui--AddressMini-address {
    overflow: hidden;
    text-align: left;
    text-overflow: ellipsis;

    > div {
      overflow: hidden;
      text-overflow: ellipsis;

      &.shortAddress {
        min-width: var(--width-shortaddr);
        max-width: var(--width-shortaddr);
        opacity: var(--opacity-light);
      }
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
      font-size: var(--font-size-tiny);
      margin-left: 2.25rem;
      margin-top: -0.5rem;
      text-align: left;
    }
  }

  .ui--AddressMini-icon {
    .ui--AddressMini-icon-info {
      position: absolute;
      right: -0.5rem;
      top: -0.5rem;
      z-index: 1;
    }

    .ui--IdentityIcon {
      margin-right: 0.5rem;
      vertical-align: middle;
    }
  }

  .ui--AddressMini-icon,
  .ui--AddressMini-info {
    position: relative;
    vertical-align: middle;
  }

  .ui--AddressMini-summary {
    font-size: var(--font-size-small);
    line-height: 1.2;
    margin-left: 2.25rem;
    margin-top: -0.2rem;
    text-align: left;
  }
`;

export default React.memo(AddressMini);
