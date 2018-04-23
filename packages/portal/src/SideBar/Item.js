// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BaseProps, Route } from '../types';

import './Item.css';

import React from 'react';
import { NavLink } from 'react-router-dom';
import Icon from 'semantic-ui-react/dist/es/elements/Icon';
import Menu from 'semantic-ui-react/dist/es/collections/Menu';

type Props = BaseProps & Route & {};

export default function Item ({ className, i18n, icon, isExact, name, path, style, t }: Props) {
  return (
    <Menu.Item
      className={['portal--SideBar-Item', className].join(' ')}
      name={name}
      style={style}
    >
      <NavLink
        activeClassName='portal--SideBar-Item-NavLink-active'
        className='portal--SideBar-Item-NavLink'
        exact={isExact}
        // flowlint-next-line sketchy-null-string:off
        to={path || `/${name}`}
      >
        <Icon name={icon} /> {t(`sidebar.${name}`, i18n)}
      </NavLink>
    </Menu.Item>
  );
}
