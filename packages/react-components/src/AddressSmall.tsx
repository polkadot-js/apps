// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AccountId, Address } from '@polkadot/types/interfaces';

import React from 'react';
import styled from 'styled-components';

import ParentAddress from '@polkadot/react-components/ParentAddress';

import AccountName from './AccountName';
import IdentityIcon from './IdentityIcon';

interface Props {
  children?: React.ReactNode;
  className?: string;
  defaultName?: string;
  onClickName?: () => void;
  overrideName?: React.ReactNode;
  parentAddress?: string;
  withSidebar?: boolean;
  toggle?: unknown;
  value?: string | Address | AccountId | null | Uint8Array;
}

function AddressSmall ({ children, className = '', defaultName, onClickName, overrideName, parentAddress, toggle, value, withSidebar = true }: Props): React.ReactElement<Props> {
  return (
    <div className={`ui--AddressSmall ${className}`}>
      <div>
        <IdentityIcon value={value as Uint8Array} />
      </div>
      <div>
        {parentAddress && <ParentAddress address={parentAddress}/>}
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
