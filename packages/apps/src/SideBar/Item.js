// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { I18nProps } from '@polkadot/ui-react-app/types';
import type { Route } from '../types';

import './Item.css';

import React from 'react';
import { NavLink } from 'react-router-dom';
import Icon from 'semantic-ui-react/dist/es/elements/Icon';
import Menu from 'semantic-ui-react/dist/es/collections/Menu';

type Props = I18nProps & Route & {};

export default function Item ({ i18n, icon, isExact, name, path = '', t }: Props): React$Node {
  return (
    <Menu.Item className='apps--SideBar-Item'>
      <NavLink
        activeClassName='apps--SideBar-Item-NavLink-active'
        className='apps--SideBar-Item-NavLink'
        exact={isExact}
        to={path || `/${name}`}
      >
        <Icon name={icon} /> {t(`sidebar.${name}`, i18n)}
      </NavLink>
    </Menu.Item>
  );
}
