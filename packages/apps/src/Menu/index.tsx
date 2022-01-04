// Copyright 2017-2022 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Route, Routes } from '@polkadot/apps-routing/types';
import type { ApiProps } from '@polkadot/react-api/types';
import type { AccountId } from '@polkadot/types/interfaces';
import type { Group, Groups, ItemRoute } from './types';

import React, { useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import createRoutes from '@polkadot/apps-routing';
import { useAccounts, useApi, useCall, useTeleport } from '@polkadot/react-hooks';

import { findMissingApis } from '../endpoint';
import { useTranslation } from '../translate';
import ChainInfo from './ChainInfo';
import Grouping from './Grouping';
import Item from './Item';
import NodeInfo from './NodeInfo';

interface Props {
  className?: string;
}

function createExternals (t: TFunction): ItemRoute[] {
  return [
    {
      href: 'https://github.com/polkadot-js/apps',
      icon: 'code-branch',
      name: 'github',
      text: t<string>('nav.github', 'GitHub', { ns: 'apps-routing' })
    },
    {
      href: 'https://wiki.polkadot.network',
      icon: 'book',
      name: 'wiki',
      text: t<string>('nav.wiki', 'Wiki', { ns: 'apps-routing' })
    }
  ];
}

function checkVisible ({ api, isApiConnected, isApiReady }: ApiProps, allowTeleport: boolean, hasAccounts: boolean, hasSudo: boolean, { isHidden, needsAccounts, needsApi, needsApiInstances, needsSudo, needsTeleport }: Route['display']): boolean {
  if (isHidden) {
    return false;
  } else if (needsAccounts && !hasAccounts) {
    return false;
  } else if (!needsApi) {
    return true;
  } else if (!isApiReady || !isApiConnected) {
    return false;
  } else if (needsSudo && !hasSudo) {
    return false;
  } else if (needsTeleport && !allowTeleport) {
    return false;
  }

  return findMissingApis(api, needsApi, needsApiInstances).length === 0;
}

function extractGroups (routing: Routes, groupNames: Record<string, string>, apiProps: ApiProps, allowTeleport: boolean, hasAccounts: boolean, hasSudo: boolean): Group[] {
  return Object
    .values(
      routing.reduce((all: Groups, route): Groups => {
        if (!all[route.group]) {
          all[route.group] = {
            name: groupNames[route.group],
            routes: [route]
          };
        } else {
          all[route.group].routes.push(route);
        }

        return all;
      }, {})
    )
    .map(({ name, routes }): Group => ({
      name,
      routes: routes.filter(({ display }) =>
        checkVisible(apiProps, allowTeleport, hasAccounts, hasSudo, display)
      )
    }))
    .filter(({ routes }) => routes.length);
}

function Menu ({ className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { allAccounts, hasAccounts } = useAccounts();
  const apiProps = useApi();
  const { allowTeleport } = useTeleport();
  const sudoKey = useCall<AccountId>(apiProps.isApiReady && apiProps.api.query.sudo?.key);
  const location = useLocation();

  const externalRef = useRef(createExternals(t));
  const routeRef = useRef(createRoutes(t));

  const groupRef = useRef({
    accounts: t('Accounts'),
    developer: t('Developer'),
    governance: t('Governance'),
    network: t('Network'),
    settings: t('Settings')
  });

  const hasSudo = useMemo(
    () => !!sudoKey && allAccounts.some((a) => sudoKey.eq(a)),
    [allAccounts, sudoKey]
  );

  const visibleGroups = useMemo(
    () => extractGroups(routeRef.current, groupRef.current, apiProps, allowTeleport, hasAccounts, hasSudo),
    [allowTeleport, apiProps, hasAccounts, hasSudo]
  );

  const activeRoute = useMemo(
    () => routeRef.current.find(({ name }) =>
      location.pathname.startsWith(`/${name}`)
    ) || null,
    [location]
  );

  return (
    <div className={`${className}${(!apiProps.isApiReady || !apiProps.isApiConnected) ? ' isLoading' : ''} highlight--bg`}>
      <div className='menuContainer'>
        <div className='menuSection'>
          <ChainInfo />
          <ul className='menuItems'>
            {visibleGroups.map(({ name, routes }): React.ReactNode => (
              <Grouping
                isActive={activeRoute && activeRoute.group === name.toLowerCase()}
                key={name}
                name={name}
                routes={routes}
              />
            ))}
          </ul>
        </div>
        <div className='menuSection media--1200'>
          <ul className='menuItems'>
            {externalRef.current.map((route): React.ReactNode => (
              <Item
                isLink
                isToplevel
                key={route.name}
                route={route}
              />
            ))}
          </ul>
        </div>
        <NodeInfo className='media--1400' />
      </div>
    </div>
  );
}

export default React.memo(styled(Menu)`
  width: 100%;
  padding: 0;
  z-index: 220;
  position: relative;

  & .menuContainer {
    flex-direction: row;
    align-items: center;
    display: flex;
    justify-content: space-between;
    padding: 0 1.5rem;
    width: 100%;
    max-width: var(--width-full);
    margin: 0 auto;
  }

  &.isLoading {
    background: #999 !important;

    .menuActive {
      background: var(--bg-page);
    }

    &:before {
      filter: grayscale(1);
    }

    .menuItems {
      filter: grayscale(1);
    }
  }

  .menuSection {
    align-items: center;
    display: flex;
  }

  .menuActive {
    background: var(--bg-tabs);
    border-bottom: none;
    border-radius: 0.25rem 0.25rem 0 0;
    color: var(--color-text);
    padding: 1rem 1.5rem;
    margin: 0 1rem -1px;
    z-index: 1;

    .ui--Icon {
      margin-right: 0.5rem;
    }
  }

  .menuItems {
    flex: 1 1;
    list-style: none;
    margin: 0 1rem 0 0;
    padding: 0;

    > li {
      display: inline-block;
    }

    > li + li {
      margin-left: 0.375rem
    }
  }

  .ui--NodeInfo {
    align-self: center;
  }

`);
