// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route, Routes } from '@polkadot/apps-routing/types';

import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import createRoutes from '@polkadot/apps-routing';
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
      <div className='menuItems'>
        {routing.filter((item): item is Route => !!item).map((route): React.ReactNode => (
          <Item
            key={route.name}
            onClick={
              route.Modal
                ? _toggleModal(route.name)
                : undefined
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
  z-index: 100;

  .menuItems {
    flex: 1 1;
    padding: 0.5rem 2rem;

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
