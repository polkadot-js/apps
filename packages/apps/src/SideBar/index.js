// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-app/types';

import './SideBar.css';

import React from 'react';

import Icon from '@polkadot/ui-app/src/Icon';
import Menu from '@polkadot/ui-app/src/Menu';
import classes from '@polkadot/ui-app/src/util/classes';

import routing from '../routing';
import translate from '../translate';
import Item from './Item';

type Props = I18nProps & {};

function SideBar ({ className, style, t }: Props): React$Node {
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
          routing.routes.map((route, index) => (
            route
              ? (
                <Item
                  key={route.name}
                  t={t}
                  // flowlint-next-line inexact-spread:off
                  {...route}
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
      </Menu>

    </div>
  );
}

export default translate(SideBar);
