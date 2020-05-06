// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/react-api/types';
import { Route } from '@polkadot/apps-routing/types';
import { AccountId } from '@polkadot/types/interfaces';

import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ApiPromise } from '@polkadot/api';
import { Badge, Icon, Menu, Tooltip } from '@polkadot/react-components';
import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';
import { isFunction } from '@polkadot/util';

const DUMMY_COUNTER = (): number => 0;

interface Props {
  isCollapsed: boolean;
  onClick: () => void;
  route: Route;
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

function checkVisible (name: string, { api, isApiConnected, isApiReady }: ApiProps, hasAccounts: boolean, hasSudo: boolean, { isHidden, needsAccounts, needsApi, needsSudo }: Route['display']): boolean {
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

function Item ({ isCollapsed, onClick, route }: Props): React.ReactElement<Props> | null {
  const { allAccounts, hasAccounts } = useAccounts();
  const apiProps = useApi();
  const sudoKey = useCall<AccountId>(apiProps.isApiReady && apiProps.api.query.sudo?.key, []);
  const [hasSudo, setHasSudo] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const count = (route.useCounter || DUMMY_COUNTER)();

  useEffect((): void => {
    setHasSudo(!!sudoKey && allAccounts.some((address): boolean => sudoKey.eq(address)));
  }, [allAccounts, sudoKey]);

  useEffect((): void => {
    const isVisible = checkVisible(route.name, apiProps, hasAccounts, hasSudo, route.display);

    route.isIgnored = !isVisible;
    setIsVisible(isVisible);
  }, [apiProps, hasAccounts, hasSudo, route]);

  if (!isVisible) {
    return null;
  }

  const { Modal, icon, name, text } = route;

  const body = (
    <>
      <Icon name={icon} />
      <span className='text'>{text}</span>
      {count !== 0 && (
        <Badge
          info={count}
          isInline
          type='counter'
        />
      )}
      <Tooltip
        offset={TOOLTIP_OFFSET}
        place='right'
        text={text}
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
            activeClassName='apps--SideBar-Item-NavLink-active ui--highlight--border'
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

export default React.memo(Item);
