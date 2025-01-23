// Copyright 2017-2025 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Route, Routes } from '@polkadot/apps-routing/types';
import type { ApiProps } from '@polkadot/react-api/types';
import type { AccountId } from '@polkadot/types/interfaces';
import type { Group, Groups, ItemRoute } from './types.js';

import React, { useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import createRoutes from '@polkadot/apps-routing';
import { styled } from '@polkadot/react-components';
import { useAccounts, useApi, useCall, useTeleport } from '@polkadot/react-hooks';

import { findMissingApis } from '../endpoint.js';
import { useTranslation } from '../translate.js';
import ChainInfo from './ChainInfo.js';
import Grouping from './Grouping.js';
import Item from './Item.js';
import NodeInfo from './NodeInfo.js';

interface Props {
  className?: string;
}

function createExternals (t: (key: string, optionsOrText?: string | { replace: Record<string, unknown> }, options?: { ns: string }) => string): ItemRoute[] {
  return [
    {
      href: 'https://github.com/polkadot-js/apps',
      icon: 'code-branch',
      name: 'github',
      text: t('nav.github', 'GitHub', { ns: 'apps-routing' })
    },
    {
      href: 'https://wiki.polkadot.network',
      icon: 'book',
      name: 'wiki',
      text: t('nav.wiki', 'Wiki', { ns: 'apps-routing' })
    }
  ];
}

function checkVisible ({ api, isApiConnected, isApiReady, isDevelopment: isApiDevelopment }: ApiProps, allowTeleport: boolean, hasAccounts: boolean, hasSudo: boolean, { isDevelopment, isHidden, needsAccounts, needsApi, needsApiCheck, needsApiInstances, needsSudo, needsTeleport }: Route['display']): boolean {
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
  } else if (!isApiDevelopment && isDevelopment) {
    return false;
  }

  return findMissingApis(api, needsApi, needsApiInstances, needsApiCheck).length === 0;
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
    files: t('Files'),
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
    <StyledDiv className={`${className}${(!apiProps.isApiReady || !apiProps.isApiConnected) ? ' isLoading' : ''} highlight--bg`}>
      <div className='menuContainer'>
        <div className='menuSection'>
          <ChainInfo />
          <ul className='menuItems'>
            {visibleGroups.map(({ name, routes }): React.ReactNode => (
              <Grouping
                isActive={!!activeRoute && activeRoute.group === name.toLowerCase()}
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
    </StyledDiv>
  );
}

const StyledDiv = styled.div`
  width: 100%;
  padding: 0;
  z-index: 220;
  position: relative;

  .smallShow {
    display: none;
  }

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

  @media only screen and (max-width: 800px) {
    .groupHdr {
      padding: 0.857rem 0.75rem;
    }

    .smallShow {
      display: initial;
    }

    .smallHide {
      display: none;
    }

    .menuItems {
      margin-right: 0;

      > li + li {
        margin-left: 0.25rem;
      }
    }
  }
`;

export default React.memo(Menu);
