// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps } from './types';

import React from 'react';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';

import classes from './util/classes';

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

class Tabs extends React.PureComponent<Props> {
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

    return (
      <NavLink
        activeClassName='active'
        className='item'
        exact={!hasParams}
        key={to}
        strict={!hasParams}
        to={to}
      >
        {text}
      </NavLink>
    );
  }
}

export default withRouter(Tabs as React.ComponentType<any>) as any as React.ComponentType<Props>;
