// Copyright 2017-2018 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';

import './SideBar.css';

import React from 'react';
import Icon from '@polkadot/ui-app/Icon';
import Menu from '@polkadot/ui-app/Menu';
import classes from '@polkadot/ui-app/util/classes';

import routing from '../routing';
import translate from '../translate';
import Item from './Item';

type Props = I18nProps & {
  children?: React.ReactNode
};

class SideBar extends React.PureComponent<Props> {
  render () {
    const { children, className, style, t } = this.props;

    return (
      <div
        className={classes('apps--SideBar', className)}
        style={style}
      >
        <Menu
          secondary
          vertical
        >
          {
            routing.routes
              .filter((route) =>
                !route || !route.isHidden
              )
              .map((route, index) => (
                route
                  ? (
                    <Item
                      key={route.name}
                      t={t}
                      route={route}
                    />
                  )
                  : (
                    <Menu.Divider
                      hidden
                      key={index}
                    />
                  )
              ))
          }
          <Menu.Divider hidden />
          <Menu.Item className='apps--SideBar-Item'>
            <a
              className='apps--SideBar-Item-NavLink'
              href='https://github.com/polkadot-js/apps'>
              <Icon name='github' /> GitHub
            </a>
          </Menu.Item>
          <Menu.Divider hidden />
          {children}
        </Menu>
      </div>
    );
  }
}

export default translate(SideBar);
