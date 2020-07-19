// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Address, AccountId } from '@polkadot/types/interfaces';

import React from 'react';
import styled from 'styled-components';

import AccountName from './AccountName';
import IdentityIcon from './IdentityIcon';

interface Props {
  children?: React.ReactNode;
  className?: string;
  defaultName?: string;
  onClickName?: () => void;
  overrideName?: React.ReactNode;
  withSidebar?: boolean;
  toggle?: unknown;
  value?: string | Address | AccountId | null | Uint8Array;
}

function AddressSmall ({ children, className = '', defaultName, onClickName, overrideName, toggle, value, withSidebar = true }: Props): React.ReactElement<Props> {
  return (
    <div className={`ui--AddressSmall ${className}`}>
      <IdentityIcon value={value as Uint8Array} />
      <AccountName
        className={withSidebar ? 'withSidebar' : ''}
        defaultName={defaultName}
        onClick={onClickName}
        override={overrideName}
        toggle={toggle}
        value={value}
        withSidebar={withSidebar}
      >
        {children}
      </AccountName>
    </div>
  );
}

export default React.memo(styled(AddressSmall)`
  white-space: nowrap;

  .ui--IdentityIcon,
  .ui--AccountName {
    vertical-align: middle;
  }

  .ui--IdentityIcon {
    margin-right: 0.75rem;
  }

  .ui--AccountName {
    display: inline-block;
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
