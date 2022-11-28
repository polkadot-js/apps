// Copyright 2017-2022 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { TabItem } from '@polkadot/react-components/Tabs/types';
import type { KeyedEvent } from '@polkadot/react-query/types';

import React, { useContext, useRef, useState } from 'react';
import { Route, Switch } from 'react-router';

import { Tabs } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { BlockAuthorsContext, EventsContext } from '@polkadot/react-query';
import { isFunction } from '@polkadot/util';

import Api from './Api';
import BlockInfo from './BlockInfo';
import Forks from './Forks';
import Latency from './Latency';
import Main from './Main';
import NodeInfo from './NodeInfo';
import MasterMembersList from './Dock/MasterMembersList';
import { useTranslation } from './translate';

interface Props {
  basePath: string;
  className?: string;
  newEvents?: KeyedEvent[];
}

function createPathRef (basePath: string): Record<string, string | string[]> {
  return {
    api: `${basePath}/api`,
    forks: `${basePath}/forks`,
    latency: `${basePath}/latency`,
    node: `${basePath}/node`,
    query: [
      `${basePath}/query/:value`,
      `${basePath}/query/`
    ]
  };
}

function createItemsRef (t: TFunction): TabItem[] {
  return [
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
      name: 'latency',
      text: t<string>('Latency')
    },
    {
      name: 'forks',
      text: t<string>('Forks')
    },
    {
      name: 'node',
      text: t<string>('Node info')
    },
    {
      // isHidden: true,
      name: 'api',
      text: t<string>('API stats')
    }
  ];
}

function ExplorerApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { lastHeaders } = useContext(BlockAuthorsContext);
  const { eventCount, events } = useContext(EventsContext);
  const itemsRef = useRef(createItemsRef(t));
  const pathRef = useRef(createPathRef(basePath));
  const hidden = useState(() => isFunction(api.query.babe?.authorities) ? [] : ['forks']);

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
        <Route path={pathRef.current.api}><Api /></Route>
        <Route path={pathRef.current.forks}><Forks /></Route>
        <Route path={pathRef.current.latency}><Latency /></Route>
        <Route path={pathRef.current.query}><BlockInfo /></Route>
        <Route path={pathRef.current.node}><NodeInfo /></Route>
        <Route>
          <Main
            eventCount={eventCount}
            events={events}
            headers={lastHeaders}
          />
        </Route>
      </Switch>
    </main>
  );
}

export default React.memo(ExplorerApp);
