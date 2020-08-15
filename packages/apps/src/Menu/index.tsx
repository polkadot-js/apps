// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route, RouteGroup, Routes } from '@polkadot/apps-routing/types';
import { ApiProps } from '@polkadot/react-api/types';
import { AccountId } from '@polkadot/types/interfaces';

import React, { useCallback, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import createRoutes from '@polkadot/apps-routing';
import { Icon } from '@polkadot/react-components';
import { useAccounts, useApi, useCall, useIpfs } from '@polkadot/react-hooks';

import { findMissingApis } from '../endpoint';
import { useTranslation } from '../translate';
import ChainInfo from './ChainInfo';
import Endpoints from './Endpoints';

interface Props {
  className?: string;
}

interface Group {
  isTop?: boolean;
  name: string;
  routes: Routes;
}

type Groups = Record<string, Group>;

const disabledLog = new Map<string, string>();

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
          all[route.group] = { isTop: name === 'menu', name: groupNames[route.group], routes: [route] };
        } else {
          all[route.group].routes.push(route);
        }

        return all;
      }, {})
    )
    .map(({ isTop, name, routes }): Group => ({
      isTop,
      name,
      routes: routes.filter(({ display, name }) => checkVisible(name, apiProps, hasAccounts, hasSudo, display))
    }))
    .filter(({ routes }) => routes.length);
}

function Menu ({ className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { allAccounts, hasAccounts } = useAccounts();
  const apiProps = useApi();
  const sudoKey = useCall<AccountId>(apiProps.isApiReady && apiProps.api.query.sudo?.key, []);
  const location = useLocation();
  const { ipnsChain } = useIpfs();
  const [modals, setModals] = useState<Record<string, boolean>>(
    createRoutes(t).reduce((result: Record<string, boolean>, route): Record<string, boolean> => {
      if (route && route.Modal) {
        result[route.name] = false;
      }

      return result;
    }, { network: false })
  );

  const hasSudo = useMemo(
    () => !!sudoKey && allAccounts.some((address) => sudoKey.eq(address)),
    [allAccounts, sudoKey]
  );

  const routing = useMemo<Routes>(
    () => createRoutes(t),
    [t]
  );

  const groupNames = useMemo<Record<RouteGroup, string>>(
    () => ({
      accounts: t('Accounts'),
      developer: t('Developer'),
      governance: t('Governance'),
      network: t('Network'),
      settings: t('Settings'),
      social: t('Social')
    }),
    [t]
  );

  const visibleGroups = useMemo(
    () => extractGroups(routing, groupNames, apiProps, hasAccounts, hasSudo),
    [apiProps, groupNames, hasAccounts, hasSudo, routing]
  );

  const activeRoute = useMemo(
    () => routing.find((route) => location.pathname.startsWith(`/${route.name}`)) || null,
    [location, routing]
  );

  const _switchRoute = useCallback(
    (hash: string): () => void => () => {
      window.location.hash = hash;
    },
    []
  );

  const _toggleModal = useCallback(
    (name: string): () => void =>
      (): void => setModals((modals: Record<string, boolean>) => ({
        ...modals,
        [name]: !modals[name]
      })),
    []
  );

  return (
    <div className={`${className} ui--highlight--border`}>
      <ChainInfo
        isToggled={modals.network}
        onClick={
          ipnsChain
            ? undefined
            : _toggleModal('network')
        }
      />
      {activeRoute && (
        <div className='menuActive ui--highlight--border'>
          <Icon icon={activeRoute.icon} />
          <span>{activeRoute.text}</span>
        </div>
      )}
      <div className='menuItems'>
        {visibleGroups.map(({ name, routes }): React.ReactNode => (
          <div key={name}>
            <div>
              <span>{name}</span>
              <Icon icon='caret-down' />
            </div>
            <ul>
              {routes.map(({ Modal, icon, name, text }): React.ReactNode => (
                <li
                  key={name}
                  onClick={
                    Modal
                      ? _toggleModal(name)
                      : _switchRoute(name)
                  }
                >
                  <Icon icon={icon} />
                  {text}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {modals.network && (
        <Endpoints onClose={_toggleModal('network')} />
      )}
      {routing.map((route): React.ReactNode => (
        route.Modal
          ? route.Modal && modals[route.name]
            ? (
              <route.Modal
                key={route.name}
                onClose={_toggleModal(route.name)}
              />
            )
            : <div key={route.name} />
          : null
      ))}
    </div>
  );
}

export default React.memo(styled(Menu)`
  align-items: flex-end;
  background: #4f5255;
  border-top: 0.5rem solid transparent;
  box-sizing: border-box;
  display: flex;
  padding: 0;

  .menuActive {
    background: #f5f4f3;
    border-radius: 0.25rem 0.25rem 0 0;
    padding: 1rem 1.75rem 0.75rem;
    margin: 0 1.5rem;

    .ui--Icon {
      margin-right: 0.5rem;
    }
  }

  .menuItems {
    color: #f5f4f3;
    cursor: pointer;
    flex: 1 1;
    margin: 0 3.5rem 0 2rem;

    > div {
      display: inline-block;
      position: relative;

      > div {
        background: #4f5255;
        border-radius: 0.25rem 0 0 0;
        padding: 1rem 1.5rem;

        > .ui--Icon {
          margin-left: 0.75rem;
        }
      }

      ul {
        background: #4f5255;
        border-radius: 0 0 0.25rem 0.25rem;
        display: none;
        list-style-type: none;
        margin: 0;
        padding: 0.75rem;
        position: absolute;
        z-index: 10;

        li {
          border-radius: 0.25rem;
          padding: 0.75rem 3.5rem 0.75rem 1.5rem;
          white-space: nowrap;

          > .ui--Icon {
            margin-right: 0.5rem;
          }

          &:hover {
            background: rgba(245, 244, 243, 0.15);
          }
        }
      }

      &:hover {
        background: #4f5255;

        > div,
        > ul {
          filter: brightness(1.15);
        }

        ul {
          display: block;
        }
      }
    }
  }
`);
