// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { KeyedEvent } from '@polkadot/react-query/types';

import React, { useContext, useRef } from 'react';
import { Route, Switch } from 'react-router';
import Tabs from '@polkadot/react-components/Tabs';
import { useApi } from '@polkadot/react-hooks';
import { BlockAuthorsContext, EventsContext } from '@polkadot/react-query';

import BlockInfo from './BlockInfo';
import Forks from './Forks';
import Main from './Main';
import NodeInfo from './NodeInfo';
import { useTranslation } from './translate';

interface Props {
  basePath: string;
  className?: string;
  newEvents?: KeyedEvent[];
}

const HIDDESN_NOBABE = ['forks'];

function ExplorerApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { lastHeaders } = useContext(BlockAuthorsContext);
  const events = useContext(EventsContext);

  const itemsRef = useRef([
    {
      isRoot: true,
      name: 'chain',
      text: t<string>('Chain info')
    },
    {
      hasParams: true,
      name: 'query',
      text: t<string>('Block details')
    },
    {
      name: 'forks',
      text: t<string>('Forks')
    },
    {
      name: 'node',
      text: t<string>('Node info')
    }
  ]);

  return (
    <main className={className}>
      <header>
        <Tabs
          basePath={basePath}
          hidden={api.query.babe ? undefined : HIDDESN_NOBABE}
          items={itemsRef.current}
        />
      </header>
      <Switch>
        <Route path={`${basePath}/forks`}><Forks /></Route>
        <Route path={`${basePath}/query/:value`}><BlockInfo /></Route>
        <Route path={`${basePath}/query`}><BlockInfo /></Route>
        <Route path={`${basePath}/node`}><NodeInfo /></Route>
        <Route>
          <Main
            events={events}
            headers={lastHeaders}
          />
        </Route>
      </Switch>
    </main>
  );
}

export default React.memo(ExplorerApp);
