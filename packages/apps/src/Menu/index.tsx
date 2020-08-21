// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route, Routes } from '@polkadot/apps-routing/types';
import { ApiProps } from '@polkadot/react-api/types';
import { AccountId } from '@polkadot/types/interfaces';
import { Group, Groups, ItemRoute } from './types';

import { TFunction } from 'i18next';
import React, { useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import createRoutes from '@polkadot/apps-routing';
import { Icon } from '@polkadot/react-components';
import { useAccounts, useApi, useCall } from '@polkadot/react-hooks';

import { findMissingApis } from '../endpoint';
import { useTranslation } from '../translate';
import ChainInfo from './ChainInfo';
import Grouping from './Grouping';
import Item from './Item';
import NodeInfo from './NodeInfo';

interface Props {
  className?: string;
}

const disabledLog = new Map<string, string>();

function createExternals (t: TFunction): ItemRoute[] {
  return [
    { href: 'https://github.com/polkadot-js/apps', icon: 'code-branch', name: 'github', text: t<string>('nav.github', 'GitHub', { ns: 'apps-routing' }) },
    { href: 'https://wiki.polkadot.network', icon: 'book', name: 'wiki', text: t<string>('nav.wiki', 'Wiki', { ns: 'apps-routing' }) }
  ];
}

function logDisabled (route: string, message: string): void {
  if (!disabledLog.get(route)) {
    disabledLog.set(route, message);

    console.warn(`Disabling ${route}: ${message}`);
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

  const notFound = findMissingApis(api, needsApi);

  if (notFound.length !== 0) {
    logDisabled(name, `API not available: ${notFound.toString()}`);
  }

  return notFound.length === 0;
}

function extractGroups (routing: Routes, groupNames: Record<string, string>, apiProps: ApiProps, hasAccounts: boolean, hasSudo: boolean): Group[] {
  return Object
    .values(
      routing.reduce((all: Groups, route): Groups => {
        if (!all[route.group]) {
          all[route.group] = { name: groupNames[route.group], routes: [route] };
        } else {
          all[route.group].routes.push(route);
        }

        return all;
      }, {})
    )
    .map(({ name, routes }): Group => ({
      name,
      routes: routes.filter(({ display, name }) => checkVisible(name, apiProps, hasAccounts, hasSudo, display))
    }))
    .filter(({ routes }) => routes.length);
}

function Menu ({ className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { allAccounts, hasAccounts } = useAccounts();
  const apiProps = useApi();
  const sudoKey = useCall<AccountId>(apiProps.isApiReady && apiProps.api.query.sudo?.key);
  const location = useLocation();

  const externalRef = useRef(createExternals(t));

  const groupRef = useRef({
    accounts: t('Accounts'),
    developer: t('Developer'),
    governance: t('Governance'),
    network: t('Network'),
    settings: t('Settings')
  });

  const routeRef = useRef(createRoutes(t));

  const hasSudo = useMemo(
    () => !!sudoKey && allAccounts.some((address) => sudoKey.eq(address)),
    [allAccounts, sudoKey]
  );

  const visibleGroups = useMemo(
    () => extractGroups(routeRef.current, groupRef.current, apiProps, hasAccounts, hasSudo),
    [apiProps, hasAccounts, hasSudo]
  );

  const activeRoute = useMemo(
    () => routeRef.current.find((route) => location.pathname.startsWith(`/${route.name}`)) || null,
    [location]
  );

  const isLoading = !apiProps.isApiReady || !apiProps.isApiConnected;

  return (
    <div className={`${className} menuBg ui--highlight--before ui--highlight--border`}>
      <div className='menuSection'>
        <ChainInfo />
        {activeRoute && (
          <div className={`menuActive${isLoading ? ' isLoading' : ''}`}>
            <Icon icon={activeRoute.icon} />
            <span>{activeRoute.text}</span>
          </div>
        )}
        <ul className='menuItems'>
          {visibleGroups.map(({ name, routes }): React.ReactNode => (
            <Grouping
              key={name}
              name={name}
              routes={routes}
            />
          ))}
        </ul>
      </div>
      <div className='menuSection ui--media-1200'>
        <ul className='menuItems'>
          {externalRef.current.map((route): React.ReactNode => (
            <Item
              className='topLevel'
              key={route.name}
              route={route}
            />
          ))}
        </ul>
      </div>
      <NodeInfo />
    </div>
  );
}

export default React.memo(styled(Menu)`
  align-items: center;
  border-top: 0.5rem solid transparent;
  display: flex;
  justify-content: space-between;
  padding: 0;
  position: relative;
  z-index: 220;

  &.menuBg,
  .menuBg {
    &:before {
      bottom: 0;
      content: ' ';
      filter: invert(0.4) brightness(0.7);
      left: 0;
      position: absolute;
      right: 0;
      top: 0;
      z-index: -1;
    }
  }

  .menuSection {
    align-items: flex-end;
    align-self: flex-end;
    display: flex;
  }

  .menuActive {
    background: #fefcfa;
    border-radius: 0.25rem 0.25rem 0 0;
    padding: 1rem 1.5rem;
    margin: 0 1rem;

    &.isLoading {
      background: #f5f3f1;
    }

    .ui--Icon {
      margin-right: 0.5rem;
    }
  }

  .menuItems {
    color: #f5f4f3;
    flex: 1 1;
    list-style: none;
    margin: 0 1rem 0 0;
    padding: 0;

    > li {
      display: inline-block;
    }
  }
`);
