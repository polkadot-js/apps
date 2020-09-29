// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { TabItem } from './types';

import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import Badge from '../Badge';
import Icon from '../Icon';

interface Props extends TabItem {
  basePath: string;
  className?: string;
  count?: number;
  index: number;
  isSequence?: boolean;
  num: number;
}

function Tab ({ basePath, className = '', count, hasParams, index, isExact, isRoot, isSequence, name, num, text }: Props): React.ReactElement<Props> {
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
      {!!count && (
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
  position: relative;
  border-bottom: 2px solid transparent;
  color: #4e4e4e !important;
  margin-bottom: -3px;
  padding: 0 1.5rem;
  height: 100%;
  display: flex;
  align-items: center;

  &.tabLinkActive::after {
    content: '';
    position: absolute;
    width: 3.14rem;
    height: 2px;
    background: #e6e6e6;
    bottom: -1px;
    left: 50%;
    transform: translateX(-50%);
  }

  &:hover {
    color: inherit !important;

    &:not(.tabLinkActive::after) {
      background: #e6e6e6;
    }
  }

  .tabCounter {
    margin: -1rem 0 -1rem 0.75rem;
  }

  .tabIcon {
    margin-left: 0.75rem;
  }
`);
