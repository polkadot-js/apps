// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, Address } from '@polkadot/types/interfaces';

import React from 'react';
import styled from 'styled-components';

import AccountName from './AccountName';
import IdentityIcon from './IdentityIcon';
import ParentAccount from './ParentAccount';
import { toShortAddress } from './util';

interface Props {
  children?: React.ReactNode;
  className?: string;
  defaultName?: string;
  onClickName?: () => void;
  overrideName?: React.ReactNode;
  parentAddress?: string;
  withSidebar?: boolean;
  withShortAddress?: boolean;
  toggle?: unknown;
  value?: string | Address | AccountId | null | Uint8Array;
}

function AddressSmall ({ children, className = '', defaultName, onClickName, overrideName, parentAddress, toggle, value, withShortAddress = false, withSidebar = true }: Props): React.ReactElement<Props> {
  const displayAsGrid = parentAddress || withShortAddress;

  return (
    <div className={`ui--AddressSmall ${className}`}>
      <div>
        <IdentityIcon value={value as Uint8Array} />
      </div>
      <div className={displayAsGrid ? 'addressGrid' : ''}>
        {parentAddress && (
          <div className='parentAccountName'>
            <ParentAccount address={parentAddress} />
          </div>
        )}
        <AccountName
          className={`accountName ${withSidebar ? 'withSidebar' : ''}`}
          defaultName={defaultName}
          onClick={onClickName}
          override={overrideName}
          toggle={toggle}
          value={value}
          withSidebar={withSidebar}
        >
          {children}
        </AccountName>
        {withShortAddress && (
          <div
            className='shortAddress'
            data-testid='short-address'
          >
            {toShortAddress(value)}
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(styled(AddressSmall)`
  white-space: nowrap;
  display: flex;
  align-items: center;

  .ui--IdentityIcon {
    margin-right: 0.75rem;
    vertical-align: middle;
  }

  .parentAccountName,
  .shortAddress {
    display: flex;
    flex-direction: column;
    align-self: center;
  }

  .parentAccountName {
    grid-area: parentAccountName;
  }

  .accountName {
    grid-area: accountName;
  }

  .shortAddress {
    grid-area: shortAddress;
    color: #8B8B8B;
    font-size: 0.75rem;
  }

  .addressGrid {
    border: 0.031rem;
    height: 3.438rem;
    display: grid;
    grid-template-columns: max-content;
    grid-template-rows: 30% 40% 30%;
    grid-template-areas:
    "parentAccountName"
    "accountName"
    "shortAddress";
  }

  .ui--AccountName {
    max-width: 26rem;
    overflow: hidden;

    &.withSidebar {
      cursor: help;
    }

    @media only screen and (max-width: 1700px) {
      max-width: 24rem;
    }

    @media only screen and (max-width: 1600px) {
      max-width: 22rem;
    }

    @media only screen and (max-width: 1500px) {
      max-width: 20rem;
    }

    @media only screen and (max-width: 1400px) {
      max-width: 18rem;
    }

    @media only screen and (max-width: 1300px) {
      max-width: 16rem;
    }

    @media only screen and (max-width: 1200px) {
      max-width: 14rem;
    }

    @media only screen and (max-width: 1200px) {
      max-width: 12rem;
    }
  }
`);
