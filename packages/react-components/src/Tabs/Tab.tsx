// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ThemeProps } from '../types';
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

export default React.memo(styled(Tab)(({ theme }: ThemeProps) => `
  position: relative;
  display: flex;
  align-items: center;
  color: #8B8B8B;
  padding: 0 1.5rem;
  height: 100%;
  font-size: 1rem;
  font-weight: 500;

  &:hover {
    &::after {
      content: '';
      position: absolute;
      width: 3.14rem;
      height: 2px;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      background-color: #8B8B8B;
    }
    color: #8B8B8B
  }

  &.tabLinkActive {
    color: ${theme.color};
    font-weight: 500;
    &:hover {
      cursor: default;
    }
  }

  &.tabLinkActive::after {
    content: '';
    position: absolute;
    width: 3.14rem;
    height: 2px;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
  }

  .tabCounter {
    margin: -1rem 0 -1rem 0.75rem;
  }

  .tabIcon {
    margin-left: 0.75rem;
  }
`));
