// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiProps } from '@polkadot/react-api/types';
import { AppProps, BareProps, I18nProps } from '@polkadot/react-components/types';
import { EventRecord } from '@polkadot/types/interfaces';
import { KeyedEvent } from './types';

import React, { useContext, useEffect, useState } from 'react';
import { Route, Switch } from 'react-router';
import styled from 'styled-components';
import { ApiContext, withCalls, withMulti } from '@polkadot/react-api';
import Tabs from '@polkadot/react-components/Tabs';
import { BlockAuthorsContext } from '@polkadot/react-query';
import uiSettings from '@polkadot/ui-settings';
import { stringToU8a } from '@polkadot/util';
import { xxhashAsHex } from '@polkadot/util-crypto';

import BlockInfo from './BlockInfo';
import Forks from './Forks';
import Main from './Main';
import NodeInfo from './NodeInfo';
import translate from './translate';

interface Props extends ApiProps, AppProps, BareProps, I18nProps {
  newEvents?: KeyedEvent[];
}

const MAX_ITEMS = 15;

function ExplorerApp ({ basePath, className, newEvents, t }: Props): React.ReactElement<Props> {
  const { api } = useContext(ApiContext);
  const { lastHeaders } = useContext(BlockAuthorsContext);
  const [{ prevEventHash, events }, setEvents] = useState<{ prevEventHash: string; events: KeyedEvent[] }>({ prevEventHash: '', events: [] });

  useEffect((): void => {
    const newEventHash = xxhashAsHex(stringToU8a(JSON.stringify(newEvents)));

    if (newEventHash !== prevEventHash && newEvents) {
      setEvents({
        prevEventHash: newEventHash,
        events: newEvents.concat(events).filter((_, index): boolean => index < MAX_ITEMS)
      });
    }
  }, [newEvents]);

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
          items={[
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
          ]}
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

export default withMulti(
  styled(ExplorerApp)`
    .rx--updated {
      background: transparent !important;
    }
  `,
  translate,
  withCalls<Props>(
    ['query.system.events', {
      propName: 'newEvents',
      transform: (records: EventRecord[]): KeyedEvent[] =>
        records
          .filter(({ event }): boolean => event.section !== 'system')
          .map((record, index): KeyedEvent => ({ key: `${Date.now()}-${index}`, record }))
    }]
  )
);
