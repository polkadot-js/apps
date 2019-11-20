// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/react-api/types';
import { I18nProps } from '@polkadot/react-components/types';
import { Route } from '@polkadot/apps-routing/types';
import { AccountId } from '@polkadot/types/interfaces';

import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ApiPromise } from '@polkadot/api';
import { Icon, Menu, Tooltip } from '@polkadot/react-components';
import { withCalls, withMulti } from '@polkadot/react-api';
import { useAccounts, useApi } from '@polkadot/react-hooks';
import { isFunction } from '@polkadot/util';

import translate from '../translate';

interface Props extends I18nProps {
  isCollapsed: boolean;
  onClick: () => void;
  route: Route;
  sudoKey?: AccountId;
}

const disabledLog: Map<string, string> = new Map();
const TOOLTIP_OFFSET = { right: -4 };

function logDisabled (route: string, message: string): void {
  if (!disabledLog.get(route)) {
    disabledLog.set(route, message);

    console.warn(`Disabling ${route}: ${message}`);
  }
}

function hasEndpoint (api: ApiPromise, endpoint: string): boolean {
  const [area, section, method] = endpoint.split('.');

  try {
    return isFunction((api as any)[area][section][method]);
  } catch (error) {
    return false;
  }
}

function checkVisible (name: string, { api, isApiReady, isApiConnected }: ApiProps, hasAccounts: boolean, hasSudo: boolean, { isHidden, needsAccounts, needsApi, needsSudo }: Route['display']): boolean {
  if (isHidden) {
    return false;
  } else if (needsAccounts && !hasAccounts) {
    return false;
  } else if (!needsApi) {
    return true;
  } else if (!isApiReady || !isApiConnected) {
    return false;
  } else if (needsSudo && !hasSudo) {
    logDisabled(name, 'Sudo key not available');
    return false;
  }

  const notFound = needsApi.filter((endpoint: string | string[]): boolean => {
    const hasApi = Array.isArray(endpoint)
      ? endpoint.reduce((hasApi, endpoint): boolean => hasApi || hasEndpoint(api, endpoint), false)
      : hasEndpoint(api, endpoint);

    return !hasApi;
  });

  if (notFound.length !== 0) {
    logDisabled(name, `API not available: ${notFound}`);
  }

  return notFound.length === 0;
}

function Item ({ route: { Modal, display, i18n, icon, name }, t, isCollapsed, onClick, sudoKey }: Props): React.ReactElement<Props> | null {
  const { allAccounts, hasAccounts } = useAccounts();
  const apiProps = useApi();
  const [hasSudo, setHasSudo] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect((): void => {
    setHasSudo(!!sudoKey && allAccounts.some((address): boolean => sudoKey.eq(address)));
  }, [allAccounts, sudoKey]);

  useEffect((): void => {
    setIsVisible(checkVisible(name, apiProps, hasAccounts, hasSudo, display));
  }, [apiProps, hasAccounts, hasSudo]);

  if (!isVisible) {
    return null;
  }

  const body = (
    <>
      <Icon name={icon} />
      <span className='text'>{t(`sidebar.${name}`, i18n)}</span>
      <Tooltip
        offset={TOOLTIP_OFFSET}
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
    ['query.sudo.key', { propName: 'sudoKey' }]
  )
);
