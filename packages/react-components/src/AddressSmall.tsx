// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Address, AccountId } from '@polkadot/types/interfaces';

import React from 'react';
import styled from 'styled-components';

import { classes } from './util';
import AccountIndex from './AccountIndex';
import AccountName from './AccountName';
import IdentityIcon from './IdentityIcon';

interface Props {
  children?: React.ReactNode;
  className?: string;
  defaultName?: string;
  onClickName?: () => void;
  overrideName?: React.ReactNode;
  withIndex?: boolean;
  withSidebar?: boolean;
  toggle?: any;
  value?: string | Address | AccountId | null | Uint8Array;
}

function AddressSmall ({ children, className, defaultName, onClickName, overrideName, toggle, value, withIndex, withSidebar = true }: Props): React.ReactElement<Props> {
  return (
    <div className={`ui--AddressSmall ${className}`}>
      <IdentityIcon
        size={32}
        value={value as Uint8Array}
      />
      <div className={classes('nameInfo', withSidebar && 'withSidebar')}>
        <AccountName
          className={(overrideName || !onClickName) ? '' : 'name--clickable'}
          defaultName={defaultName}
          onClick={onClickName}
          override={overrideName}
          toggle={toggle}
          value={value}
          withSidebar={withSidebar}
        >
          {children}
        </AccountName>
        {withIndex && (
          <AccountIndex value={value} />
        )}
      </div>
    </div>
  );
}

export default React.memo(styled(AddressSmall)`
  display: flex;
  align-items: center;

  .ui--IdentityIcon,
  .nameInfo {
    display: inline-block;
    vertical-align: middle;
    white-space: nowrap;
  }

  .ui--IdentityIcon {
    margin-right: 0.75rem;
  }

  .nameInfo {
    &.withSidebar {
      cursor: help;
    }

    > div {
      max-width: 12rem;
    }
  }
`);
