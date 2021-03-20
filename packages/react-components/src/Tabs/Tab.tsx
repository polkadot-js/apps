// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TabItem } from './types';

import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import Badge from '../Badge';

interface Props extends TabItem {
  basePath: string;
  className?: string;
  count?: number;
  index: number;
}

function Tab ({ basePath, className = '', count, hasParams, index, isExact, isRoot, name, text }: Props): React.ReactElement<Props> {
  const to = isRoot
    ? basePath
    : `${basePath}/${name}`;

  // only do exact matching when not the fallback (first position tab),
  // params are problematic for dynamic hidden such as app-accounts
  const tabIsExact = isExact || !hasParams || index === 0;

  return (
    <NavLink
      activeClassName='tabLinkActive'
      className={`ui--Tab ${className}`}
      exact={tabIsExact}
      strict={tabIsExact}
      to={to}
    >
      {text}{!!count && (
        <Badge
          className='tabCounter'
          color='counter'
          info={count}
        />
      )}
    </NavLink>
  );
}

export default React.memo(styled(Tab)`
  border-bottom: 2px solid transparent;
  color: var(--color-text) !important;
  margin-bottom: -3px;
  padding: 0.5rem 1.5rem 0.75rem;

  &.tabLinkActive {
    border-bottom-color: #e6e6e6;
  }

  &:hover {
    filter: highlight(120%);

    &:not(.tabLinkActive) {
      border-bottom-color: #e6e6e6;
    }
  }

  .tabCounter {
    margin: -1rem 0 -1rem 0.75rem;
  }

  .tabIcon {
    margin-left: 0.75rem;
  }
`);
