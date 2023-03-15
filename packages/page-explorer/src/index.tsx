// Copyright 2017-2023 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { TabItem } from '@polkadot/react-components/Tabs/types';
import type { KeyedEvent } from '@polkadot/react-hooks/ctx/types';

import React, { useMemo, useRef } from 'react';
import { Route, Switch } from 'react-router';

import { Tabs } from '@polkadot/react-components';
import { useApi, useBlockAuthors, useBlockEvents } from '@polkadot/react-hooks';
import { isFunction } from '@polkadot/util';

import Api from './Api/index.js';
import BlockInfo from './BlockInfo/index.js';
import Latency from './Latency/index.js';
import NodeInfo from './NodeInfo/index.js';
import Forks from './Forks.js';
import Main from './Main.js';
import { useTranslation } from './translate.js';

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
  const { lastHeaders } = useBlockAuthors();
  const { eventCount, events } = useBlockEvents();
  const itemsRef = useRef(createItemsRef(t));
  const pathRef = useRef(createPathRef(basePath));

  const hidden = useMemo<string[]>(
    () => isFunction(api.query.babe?.authorities) ? [] : ['forks'],
    [api]
  );

  return (
    <main className={className}>
      <Tabs
        basePath={basePath}
        hidden={hidden}
        items={itemsRef.current}
      />
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
