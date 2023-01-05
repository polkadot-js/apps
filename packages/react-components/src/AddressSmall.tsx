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
  const displayAsGrid = parentAddress || withShortAddress;

  return (
    <div className={`ui--AddressSmall ${className}`}>
      <div className='ui--AddressSmall-icon'>
        <IdentityIcon value={value as Uint8Array} />
      </div>
      <span className='ui--AddressSmall-info'>
        {displayAsGrid && (
          <div className='parentAccountName'>
            {parentAddress
              ? <ParentAccount address={parentAddress} />
              : <>&nbsp;</>
            }
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
  position: relative;
  text-overflow: ellipsis;
  vertical-align: middle;
  white-space: nowrap;

  .ui--AddressSmall-icon {
    bottom: 0;
    left: 0;
    position: absolute;
    top: 0;

    .ui--Identicon {
      vertical-align: middle;
    }
  }

  .ui--AddressSmall-info > div {
    margin-left: 2.75rem;
  }

  .ui--IdentityIcon {
    margin-top: 0.7rem;
  }

  .parentAccountName {
    font-size: 0.75rem;
  }

  .shortAddress {
    grid-area: shortAddress;
    color: #8B8B8B;
    font-size: 0.75rem;
  }

  .ui--AccountName {
    overflow: hidden;

    &.withSidebar {
      cursor: help;
    }
  }
`);
