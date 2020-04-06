// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

import { classes } from './util';
import Icon from './Icon';

const MyIcon = styled(Icon)`
  &&& {
    width: 1rem;
    margin: 0.7rem 0;
  }
`;

export interface TabItem {
  hasParams?: boolean;
  isExact?: boolean;
  isRoot?: boolean;
  name: string;
  text: React.ReactNode;
}

interface Props extends BareProps {
  basePath: string;
  hidden?: (string | boolean | undefined)[];
  items: TabItem[];
  isSequence?: boolean;
}

function renderItem ({ basePath, isSequence, items }: Props): (tabItem: TabItem, index: number) => React.ReactNode {
  return function Tab ({ hasParams, isRoot, name, text, ...tab }: TabItem, index: number): React.ReactNode {
    const to = isRoot
      ? basePath
      : `${basePath}/${name}`;
    // only do exact matching when not the fallback (first position tab),
    // params are problematic for dynamic hidden such as app-accounts
    const isExact = tab.isExact || !hasParams || (!isSequence && index === 0);

    return (
      <React.Fragment key={to}>
        <NavLink
          activeClassName='active'
          className='item'
          exact={isExact}
          strict={isExact}
          to={to}
        >
          {text}
        </NavLink>
        {(isSequence && index < items.length - 1) && (
          <MyIcon name='arrow right' />
        )}
      </React.Fragment>
    );
  };
}

function Tabs (props: Props): React.ReactElement<Props> {
  const { className, hidden = [], items, style } = props;

  return (
    <div
      className={classes('ui--Menu ui menu tabular', className)}
      style={style}
    >
      {items
        .filter(({ name }): boolean => !hidden.includes(name))
        .map(renderItem(props))
      }
    </div>
  );
}

export default React.memo(Tabs);
