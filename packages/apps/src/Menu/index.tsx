// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route, Routes } from '@polkadot/apps-routing/types';

import React, { useCallback, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import createRoutes from '@polkadot/apps-routing';
import { Icon } from '@polkadot/react-components';
import { useIpfs } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import ChainInfo from '../SideBar/ChainInfo';
import Endpoints from '../SideBar/Endpoints';
import Item from './Item';

interface Props {
  className?: string;
}

function Menu ({ className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
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

  const routing = useMemo<Routes>(
    () => createRoutes(t),
    [t]
  );

  const activeRoute = useMemo(
    (): Route | null => routing.find((route) => !!route && location.pathname === `/${route.name}`) || null,
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
        {routing.filter((item): item is Route => !!item).map((route): React.ReactNode => (
          <Item
            key={route.name}
            onClick={
              route.Modal
                ? _toggleModal(route.name)
                : _switchRoute(route.name)
            }
            route={route}
          />
        ))}
      </div>
      {modals.network && (
        <Endpoints onClose={_toggleModal('network')} />
      )}
      {routing.map((route): React.ReactNode => (
        route?.Modal
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
  align-items: center;
  background: #4f5255;
  border-top: 0.5rem solid transparent;
  box-sizing: border-box;
  display: flex;
  padding: 0;
  z-index: 100;

  .menuActive {
    align-self: flex-end;
    background: #f5f4f3;
    border-radius: 0.25rem 0.25rem 0 0;
    padding: 1rem 1.75rem 0.75rem;
    margin: 0 1.5rem;

    .ui--Icon {
      margin-right: 0.5rem;
    }
  }

  .menuItems {
    flex: 1 1;
    margin: 0 3.5rem 0 2rem;

    > div {
      display: inline-block;

      > a {
        border-radius: 0.25rem !important;

        > svg {
          margin-right: 0.5rem;
        }
      }
    }
  }
`);
