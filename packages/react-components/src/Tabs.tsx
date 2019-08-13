// Copyright 2017-2019 @polkadot/react-components authors & contributors
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
  hidden?: string[];
  items: TabItem[];
  isSequence?: boolean;
}

export default class Tabs extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { className, hidden = [], items, style } = this.props;
    return (
      <div
        className={classes('ui--Menu ui menu tabular', className)}
        style={style}
      >
        {
          items
            .filter(({ name }): boolean => !hidden.includes(name))
            .map(this.renderItem)
        }
      </div>
    );
  }

  private renderItem = ({ hasParams, isRoot, name, text, ...tab }: TabItem, index: number): React.ReactNode => {
    const { basePath, isSequence, items } = this.props;
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
  }
}
