// Copyright 2017-2023 @polkadot/react-components authors & contributors
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
  return (
    <div className={`ui--AddressSmall ${className}`}>
      <span className='ui--AddressSmall-icon'>
        <IdentityIcon value={value as Uint8Array} />
      </span>
      <span className='ui--AddressSmall-info'>
        {parentAddress && (
          <div className='parentName'>
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
      </span>
    </div>
  );
}

export default React.memo(styled(AddressSmall)`
  overflow-x: hidden;
  padding: 1.25rem 0;
  text-overflow: ellipsis;
  white-space: nowrap;

  .ui--IdentityIcon {
    margin-right: 0.75rem;
    vertical-align: middle;
  }

  .ui--AddressSmall-info {
    position: relative;
    vertical-align: middle;

    .parentName {
      font-size: 0.85rem;
      left: 0;
      position: absolute;
      top: -0.75rem;
    }

    .shortAddress {
      bottom: -0.85rem;
      color: #8B8B8B;
      font-size: 0.75rem;
      left: 0;
      position: absolute;
    }
  }

  .ui--AccountName {
    overflow: hidden;
    vertical-align: middle;
    white-space: nowrap;

    &.withSidebar {
      cursor: help;
    }
  }
`);
