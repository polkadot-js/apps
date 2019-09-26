// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/react-components/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { Route } from '@polkadot/apps-routing/types';

import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Icon, Menu, Tooltip } from '@polkadot/react-components';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import { ApiContext, withCalls, withMulti, withObservable } from '@polkadot/react-api';
import { isFunction } from '@polkadot/util';

import translate from '../translate';

interface Props extends I18nProps {
  isCollapsed: boolean;
  onClick: () => void;
  allAccounts?: SubjectInfo;
  route: Route;
  sudoKey: string;
}

const disabledLog: Map<string, string> = new Map();

function logDisabled (route: string, message: string): void {
  if (!disabledLog.get(route)) {
    disabledLog.set(route, message);

    console.warn(`Disabling ${route}: ${message}`);
  }
}

function Item ({ allAccounts, route: { Modal, display: { isHidden, needsAccounts, needsApi, needsSudo }, i18n, icon, name }, t, isCollapsed, onClick, sudoKey }: Props): React.ReactElement<Props> | null {
  const { api, isApiConnected, isApiReady } = useContext(ApiContext);

  const _hasApi = (endpoint: string): boolean => {
    const [area, section, method] = endpoint.split('.');

    try {
      return isFunction((api as any)[area][section][method]);
    } catch (error) {
      return false;
    }
  };
  const _isVisible = (): boolean => {
    const hasAccounts = !!allAccounts && Object.keys(allAccounts).length !== 0;
    const hasSudo = !!allAccounts && Object.keys(allAccounts).some((address): boolean => address === sudoKey);

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
        logDisabled(name, 'Sudo key not available');
        return false;
      }
    }

    const notFound = needsApi.filter((endpoint: string | string[]): boolean => {
      const hasApi = Array.isArray(endpoint)
        ? endpoint.reduce((hasApi, endpoint): boolean => hasApi || _hasApi(endpoint), false)
        : _hasApi(endpoint);

      return !hasApi;
    });

    if (notFound.length !== 0) {
      logDisabled(name, `API not available: ${notFound}`);
    }

    return notFound.length === 0;
  };

  if (!_isVisible()) {
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
      {Modal
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

export default withMulti(
  Item,
  translate,
  withCalls<Props>(
    ['query.sudo.key', {
      propName: 'sudoKey',
      transform: (key): string =>
        key.toString()
    }]
  ),
  withObservable(accountObservable.subject, { propName: 'allAccounts' })
);
