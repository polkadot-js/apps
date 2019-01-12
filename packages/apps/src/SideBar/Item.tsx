// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { Route } from '../types';

import React from 'react';
import { withRouter } from 'react-router';
import { NavLink } from 'react-router-dom';
import { Icon, Menu } from '@polkadot/ui-app/index';
import { withApi, withMulti } from '@polkadot/ui-api/index';
import { isFunction } from '@polkadot/util';

type Props = I18nProps & ApiProps & {
  route: Route
};

class Item extends React.PureComponent<Props> {
  render () {
    const { route: { i18n, icon, name }, t } = this.props;

    if (!this.isApiAvailable()) {
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

  private isApiAvailable () {
    const { apiPromise, isApiConnected, isApiReady, route: { isApiGated, name, needsApi } } = this.props;

    if (isApiGated && (!isApiReady || !isApiConnected)) {
      return false;
    } else if (!needsApi || !needsApi.length) {
      return true;
    }

    const notFound = needsApi.filter((endpoint) => {
      const [area, section, method] = endpoint.split('.');

      try {
        return !isFunction((apiPromise as any)[area][section][method]);
      } catch (error) {
        return true;
      }
    });

    if (notFound.length !== 0) {
      console.error(`Disabling route ${name}, API ${notFound} not available`);
    }

    return notFound.length === 0;
  }
}

export default withMulti(
  Item,
  withRouter,
  withApi
);
