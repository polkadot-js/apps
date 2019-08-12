// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { ApiProps } from '@polkadot/react-api/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { Route } from '@polkadot/apps-routing/types';

import React from 'react';
import { NavLink } from 'react-router-dom';
import { Icon, Menu, Tooltip } from '@polkadot/react-components';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import { withApi, withCalls, withMulti, withObservable } from '@polkadot/react-api';
import { isFunction } from '@polkadot/util';

import translate from '../translate';

type Props = I18nProps & ApiProps & {
  isCollapsed: boolean;
  onClick: () => void;
  allAccounts?: SubjectInfo;
  route: Route;
  sudo_key: string;
};

class Item extends React.PureComponent<Props> {
  private _disabledLog: Map<string, string> = new Map();

  public render (): React.ReactNode {
    const { route: { Modal, i18n, icon, name }, t, isCollapsed, onClick } = this.props;

    if (!this.isVisible()) {
      return null;
    }

    const body = (
      <>
        <Icon name={icon} />
        <span className='text'>{t(`sidebar.${name}`, i18n)}</span>
        <Tooltip
          offset={{ right: -4 }}
          place='right'
          text={t(`sidebar.${name}`, i18n)}
          trigger={`nav-${name}`}
        />
      </>
    );

    return (
      <Menu.Item className='apps--SideBar-Item'>
        {
          Modal
            ? (
              <a
                className='apps--SideBar-Item-NavLink'
                data-for={`nav-${name}`}
                data-tip
                data-tip-disable={!isCollapsed}
                onClick={onClick}
              >
                {body}
              </a>
            )
            : (
              <NavLink
                activeClassName='apps--SideBar-Item-NavLink-active'
                className='apps--SideBar-Item-NavLink'
                data-for={`nav-${name}`}
                data-tip
                data-tip-disable={!isCollapsed}
                onClick={onClick}
                to={`/${name}`}
              >
                {body}
              </NavLink>
            )
        }
      </Menu.Item>
    );
  }

  private logDisabled (route: string, message: string): void {
    if (!this._disabledLog.get(route)) {
      this._disabledLog.set(route, message);

      console.warn(`Disabling ${route}: ${message}`);
    }
  }

  private hasApi (endpoint: string): boolean {
    const { api } = this.props;
    const [area, section, method] = endpoint.split('.');

    try {
      return isFunction((api as any)[area][section][method]);
    } catch (error) {
      return false;
    }
  }

  private isVisible (): boolean {
    const { allAccounts = {}, isApiConnected, isApiReady, route: { display: { isHidden, needsAccounts, needsApi, needsSudo }, name }, sudo_key: sudoKey } = this.props;
    const hasAccounts = Object.keys(allAccounts).length !== 0;
    const hasSudo = !!Object.keys(allAccounts).find((address): boolean => address === sudoKey);

    if (isHidden) {
      return false;
    } else if (needsAccounts && !hasAccounts) {
      return false;
    } else if (!needsApi) {
      return true;
    } else if (!isApiReady || !isApiConnected) {
      return false;
    } else if (needsSudo) {
      if (!hasSudo) {
        this.logDisabled('sudo', 'Sudo key not available');
        return false;
      }
    }

    const notFound = needsApi.filter((endpoint: string | string[]): boolean => {
      const hasApi = Array.isArray(endpoint)
        ? endpoint.reduce((hasApi, endpoint): boolean => hasApi || this.hasApi(endpoint), false)
        : this.hasApi(endpoint);

      return !hasApi;
    });

    if (notFound.length !== 0) {
      this.logDisabled(name, `API not available: ${notFound}`);
    }

    return notFound.length === 0;
  }
}

export default withMulti(
  Item,
  translate,
  withApi,
  withCalls<Props>(
    ['query.sudo.key', {
      transform: (key): string =>
        key.toString()
    }]
  ),
  withObservable(accountObservable.subject, { propName: 'allAccounts' })
);
