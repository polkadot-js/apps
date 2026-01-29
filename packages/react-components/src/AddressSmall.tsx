// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, Address } from '@polkadot/types/interfaces';

import React from 'react';

import IdentityIcon from './IdentityIcon/index.js';
import AccountName from './AccountName.js';
import ParentAccount from './ParentAccount.js';
import { styled } from './styled.js';

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
  value?: string | Address | AccountId | null;
}

function AddressSmall ({ children, className = '', defaultName, onClickName, overrideName, parentAddress, toggle, value, withShortAddress = false, withSidebar = true }: Props): React.ReactElement<Props> {
  return (
    <StyledDiv className={`${className} ui--AddressSmall ${(parentAddress || withShortAddress) ? 'withPadding' : ''}`}>
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
        {value && withShortAddress && (
          <div
            className='shortAddress'
            data-testid='short-address'
          >
            {value.toString()}
          </div>
        )}
      </span>
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  &.withPadding {
    padding: 0.75rem 0;
  }

  .ui--AddressSmall-icon {
    .ui--IdentityIcon {
      margin-right: 0.5rem;
      vertical-align: middle;
    }
  }

  .ui--AddressSmall-info {
    position: relative;
    vertical-align: middle;

    .parentName, .shortAddress {
      font-size: var(--font-size-tiny);
    }

    .parentName {
      left: 0;
      position: absolute;
      top: -0.80rem;
    }

    .shortAddress {
      bottom: -0.95rem;
      color: #8B8B8B;
      display: inline-block;
      left: 0;
      min-width: var(--width-shortaddr);
      max-width: var(--width-shortaddr);
      overflow: hidden;
      position: absolute;
      text-overflow: ellipsis;
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
`;

export default React.memo(AddressSmall);
