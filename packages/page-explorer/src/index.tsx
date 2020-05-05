// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, BareProps } from '@polkadot/react-components/types';
import { KeyedEvent } from './types';

import React, { useContext, useMemo } from 'react';
import { Route, Switch } from 'react-router';
// import styled from 'styled-components';
import Tabs from '@polkadot/react-components/Tabs';
import { useApi } from '@polkadot/react-hooks';
import { BlockAuthorsContext, EventsContext } from '@polkadot/react-query';
import uiSettings from '@polkadot/ui-settings';

import BlockInfo from './BlockInfo';
import Forks from './Forks';
import Main from './Main';
import NodeInfo from './NodeInfo';
import { useTranslation } from './translate';

interface Props extends AppProps, BareProps {
  newEvents?: KeyedEvent[];
}

function ExplorerApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { lastHeaders } = useContext(BlockAuthorsContext);
  const events = useContext(EventsContext);
  const items = useMemo(() => [
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
      name: 'forks',
      text: t('Forks')
    },
    {
      name: 'node',
      text: t('Node info')
    }
  ], [t]);

  return (
    <main className={className}>
      <header>
        <Tabs
          basePath={basePath}
          hidden={
            uiSettings.uiMode === 'full'
              ? api.query.babe ? [] : ['forks']
              : ['node', 'forks']
          }
          items={items}
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
