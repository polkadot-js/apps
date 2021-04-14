// Copyright 2017-2021 @polkadot/apps authors & contributors
// and @canvas-ui/app authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiProps } from '@canvas-ui/react-api/types';

import { Route } from '@canvas-ui/app-routing/types';
import { Badge, Icon, Menu, Tooltip } from '@canvas-ui/react-components';
import { useAccounts, useApi } from '@canvas-ui/react-hooks';
import React from 'react';
import { NavLink } from 'react-router-dom';

import { ApiPromise } from '@polkadot/api';
import { isFunction } from '@polkadot/util';

const DUMMY_COUNTER = (): null => null;

interface Props {
  isCollapsed: boolean;
  onClick: () => void;
  route: Route;
}

const TOOLTIP_OFFSET = { right: -4 };

const disabledLog = new Map<string, string>();

function hasEndpoint (api: ApiPromise, endpoint: string): boolean {
  const [area, section, method] = endpoint.split('.');

  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return isFunction((api as any)[area][section][method]);
  } catch (error) {
    return false;
  }
}

function findMissingApis (api: ApiPromise, needsApi?: (string | string[])[]): (string | string[])[] {
  if (!needsApi) {
    return [];
  }

  return needsApi.filter((endpoint: string | string[]): boolean => {
    const hasApi = Array.isArray(endpoint)
      ? endpoint.reduce((hasApi, endpoint) => hasApi || hasEndpoint(api, endpoint), false)
      : hasEndpoint(api, endpoint);

    return !hasApi;
  });
}

function logDisabled (route: string, message: string): void {
  if (!disabledLog.get(route)) {
    disabledLog.set(route, message);

    console.warn(`Disabling ${route}: ${message}`);
  }
}

function checkVisible (name: string, { api, isApiConnected, isApiReady }: ApiProps, hasAccounts: boolean, { isHidden, needsAccounts, needsApi }: Route['display']): boolean {
  if (isHidden) {
    return false;
  } else if (needsAccounts && !hasAccounts) {
    return false;
  } else if (!needsApi) {
    return true;
  } else if (!isApiReady || !isApiConnected) {
    return false;
  }

  const notFound = findMissingApis(api, needsApi);

  if (notFound.length !== 0) {
    logDisabled(name, `API not available: ${notFound.toString()}`);
  }

  return notFound.length === 0;
}

function Item ({ isCollapsed, onClick, route }: Props): React.ReactElement<Props> | null {
  const api = useApi();
  const { hasAccounts } = useAccounts();

  if (route.isIgnored || !checkVisible(route.name, api, hasAccounts, route.display)) {
    return null;
  }

  const count = (route.useCounter || DUMMY_COUNTER)();

  const { name, text } = route;

  const body = (
    <>
      <span className='text'>{text}</span>
      {!!count && (
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
      <Icon icon='chevron-right' />
    </>
  );

  return (
    <Menu.Item className='app--SideBar-Item'>
      <NavLink
        activeClassName='app--SideBar-Item-NavLink-active ui--highlight--border'
        className='app--SideBar-Item-NavLink'
        data-for={`nav-${name}`}
        data-tip
        data-tip-disable={!isCollapsed}
        onClick={onClick}
        to={`/${name}`}
      >
        {body}
      </NavLink>
    </Menu.Item>
  );
}

export default React.memo(Item);
