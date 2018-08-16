// Copyright 2017-2018 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { Route } from '../types';

import './Item.css';

import React from 'react';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';

import Icon from '@polkadot/ui-app/Icon';
import Menu from '@polkadot/ui-app/Menu';

type Props = I18nProps & {
  route: Route
};

class Item extends React.PureComponent<Props> {
  render () {
    const { route: { i18n, icon, name }, t } = this.props;

    return (
      <Menu.Item className='apps--SideBar-Item'>
        <NavLink
          activeClassName='apps--SideBar-Item-NavLink-active'
          className='apps--SideBar-Item-NavLink'
          to={`/${name}`}
        >
          <Icon name={icon} /> {t(`sidebar.${name}`, i18n)}
        </NavLink>
      </Menu.Item>
    );
  }
}

// @ts-ignore the definitions complain here, however the use is valid
export default withRouter(Item);
