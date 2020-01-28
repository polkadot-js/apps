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
        <Route path={`${basePath}/forks`} component={Forks} />
        <Route path={`${basePath}/query/:value`} component={BlockInfo} />
        <Route path={`${basePath}/query`} component={BlockInfo} />
        <Route path={`${basePath}/node`} component={NodeInfo} />
        <Route render={(): React.ReactElement<{}> => (
          <Main
            events={events}
            headers={lastHeaders}
          />
        )} />
      </Switch>
    </main>
  );
}

export default ExplorerApp;

// export default styled(ExplorerApp)`
//   .explorer--Container {
//     color: inherit;

//     .header {
//       position: relative;
//       vertical-align: middle;

//       h3 {
//         margin: 0;
//       }
//     }

//     .description {
//       color: rgba(0, 0, 0, 0.6);
//       margin: 0rem 0 0.5rem 0;
//       overflow: hidden;
//       text-overflow: ellipsis;
//       vertical-align: middle;
//       white-space: nowrap;
//     }

//     > .details {
//       word-break: break-all;
//     }
//   }
// `;
