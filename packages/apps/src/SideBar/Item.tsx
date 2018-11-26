// Copyright 2017-2018 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-react-rx/types';
import { Route } from '../types';

import React from 'react';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';
import { Icon, Menu } from '@polkadot/ui-app/index';
import { withApi, withMulti } from '@polkadot/ui-react-rx/with/index';

type Props = I18nProps & ApiProps & {
  route: Route
};

class Item extends React.PureComponent<Props> {
  render () {
    const { isApiConnected, isApiReady, route: { isApiGated, i18n, icon, name }, t } = this.props;

    if (isApiGated && (!isApiReady || !isApiConnected)) {
      return null;
    }

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

export default withMulti(
  Item,
  withRouter,
  withApi
);
