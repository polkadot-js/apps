// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TabItem } from './types';

import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import Icon from '../Icon';

interface Props extends TabItem {
  basePath: string;
  className?: string;
  index: number;
  isSequence?: boolean;
  num: number;
}

function Tab ({ basePath, className = '', hasParams, index, isExact, isRoot, isSequence, name, num, text }: Props): React.ReactElement<Props> {
  const to = isRoot
    ? basePath
    : `${basePath}/${name}`;

  // only do exact matching when not the fallback (first position tab),
  // params are problematic for dynamic hidden such as app-accounts
  const tabIsExact = isExact || !hasParams || (!isSequence && index === 0);

  return (
    <NavLink
      activeClassName='tabLinkActive'
      className={`ui--Tabs-Tab ${className}`}
      exact={tabIsExact}
      strict={tabIsExact}
      to={to}
    >
      {text}{(isSequence && index < (num - 1)) && (
        <Icon
          className='tabIcon'
          icon='arrow-right'
        />
      )}
    </NavLink>
  );
}

export default React.memo(styled(Tab)`
  border-bottom: 2px solid transparent;
  color: rgba(0, 0, 0, 0.87) !important;
  padding: 0.75rem 1.5rem;

  &.tabLinkActive {
    border-bottom-color: #e6e6e6;
    color: rgba(0, 0, 0, 0.95);
    font-weight: 700;
  }

  &:hover {
    color: inherit !important;

    &:not(.tabLinkActive) {
      border-bottom-color: #e6e6e6;
    }
  }

  .tabIcon {
    margin-left: 0.75rem;
  }
`);
