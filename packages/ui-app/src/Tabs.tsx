// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import { NavLink } from 'react-router-dom';

import { classes } from './util';

export type TabItem = {
  hasParams?: boolean,
  name: string,
  text: React.ReactNode
};

type Props = BareProps & {
  basePath: string,
  hidden?: Array<string>,
  items: Array<TabItem>
};

export default class Tabs extends React.PureComponent<Props> {
  render () {
    const { className, hidden = [], items, style } = this.props;

    return (
      <div
        className={classes('ui--Menu ui menu tabular', className)}
        style={style}
      >
        {
          items
            .filter(({ name }) => !hidden.includes(name))
            .map(this.renderItem)
        }
      </div>
    );
  }

  private renderItem = ({ hasParams, name, text }: TabItem, index: number) => {
    const { basePath } = this.props;
    const to = index === 0
      ? basePath
      : `${basePath}/${name}`;
    // only do exact matching when not the fallback (first position tab),
    // params are problematic for dynamic hidden such as app-accounts
    const isExact = !hasParams || index === 0;

    return (
      <NavLink
        activeClassName='active'
        className='item'
        exact={isExact}
        key={to}
        strict={isExact}
        to={to}
      >
        {text}
      </NavLink>
    );
  }
}
