// Copyright 2017-2025 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TabItem } from '@polkadot/react-components/types';
import type { KeyedEvent } from '@polkadot/react-hooks/ctx/types';

import React, { useMemo, useRef } from 'react';
import { Route, Routes } from 'react-router';

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

function createItemsRef (t: (key: string, options?: { replace: Record<string, unknown> }) => string): TabItem[] {
  return [
    {
      isRoot: true,
      name: 'chain',
      text: t('Chain info')
    },
    {
      hasParams: true,
      name: 'query',
      text: t('Block details')
    },
    {
      name: 'latency',
      text: t('Latency')
    },
    {
      name: 'forks',
      text: t('Forks')
    },
    {
      name: 'node',
      text: t('Node info')
    },
    {
      // isHidden: true,
      name: 'api',
      text: t('API stats')
    }
  ];
}

function ExplorerApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { lastHeaders } = useBlockAuthors();
  const { eventCount, events } = useBlockEvents();
  const itemsRef = useRef(createItemsRef(t));

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
      <Routes>
        <Route path={basePath}>
          <Route
            element={<Api />}
            path='api'
          />
          <Route
            element={<Forks />}
            path='forks'
          />
          <Route
            element={<Latency />}
            path='latency'
          />
          <Route
            element={<NodeInfo />}
            path='node'
          />
          <Route
            element={<BlockInfo />}
            path='query/:value?'
          />
          <Route
            element={
              <Main
                eventCount={eventCount}
                events={events}
                headers={lastHeaders}
              />
            }
            index
          />
        </Route>
      </Routes>
    </main>
  );
}

export default React.memo(ExplorerApp);
