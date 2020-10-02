// Copyright 2017-2020 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyedEvent } from '@polkadot/react-query/types';

import React, { useContext, useRef } from 'react';
import { Route, Switch } from 'react-router';
import Tabs from '@polkadot/react-components/Tabs';
import { useApi } from '@polkadot/react-hooks';
import { BlockAuthorsContext, EventsContext } from '@polkadot/react-query';

import BlockInfo from './BlockInfo';
import Forks from './Forks';
import Main from './Main';
import DBMain from './DBMain';
import NodeInfo from './NodeInfo';
import EpochDetails from './EpochDetails';
import BlocksList from './GraphQL/BlocksList';
import EventsList from './GraphQL/EventsList';
import ExtrinsicsList from './GraphQL/ExtrinsicsList';
import TransfersList from './GraphQL/TransfersList';
import AccountsList from './GraphQL/AccountsList';
import ValidatorsList from './GraphQL/ValidatorsList';
import MasterMembersList from './GraphQL/MasterMembersList';
import EpochsList from './GraphQL/EpochsList';
import { useTranslation } from './translate';

interface Props {
  basePath: string;
  className?: string;
  newEvents?: KeyedEvent[];
}

const HIDDESN_NOBABE = ['forks'];

import { ApolloProvider } from 'react-apollo';
import client, { shouldUseDB } from './apollo';

function ExplorerApp ({ basePath, className }: Props): React.ReactElement<Props> {
  // const { loading, error, data } = useQuery(GET_DOGS);
  const { t } = useTranslation();
  const { api } = useApi();
  const { lastHeaders } = useContext(BlockAuthorsContext);
  const events = useContext(EventsContext);
  const showDBStates = shouldUseDB();

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
    },
    {
      name: 'epochs',
      text: t<string>('Epochs')
    },
  ].concat(showDBStates ? [{
      name: 'blocks',
      text: t<string>('Blocks')
    },
    {
      name: 'events',
      text: t<string>('Events')
    },
    {
      name: 'extrinsics',
      text: t<string>('Extrinsics')
    },
    {
      name: 'transfers',
      text: t<string>('Transfers')
    },
    {
      name: 'accounts',
      text: t<string>('Accounts')
    },
    {
      name: 'validators',
      text: t<string>('Validators')
    },
    {
      name: 'master-members',
      text: t<string>('Master Members')
    }] : []));

  return (
    <ApolloProvider client={client}>
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
          <Route path={`${basePath}/blocks`}><BlocksList /></Route>
          <Route path={`${basePath}/events`}><EventsList /></Route>
          <Route path={`${basePath}/extrinsics`}><ExtrinsicsList /></Route>
          <Route path={`${basePath}/transfers`}><TransfersList /></Route>
          <Route path={`${basePath}/accounts`}><AccountsList /></Route>
          <Route path={`${basePath}/validators`}><ValidatorsList /></Route>
          <Route path={`${basePath}/master-members`}><MasterMembersList /></Route>
          <Route path={`${basePath}/epochs/:value`} component={EpochDetails}/>
          <Route path={`${basePath}/epochs`}><EpochsList /></Route>
          <Route>
            <Main
              events={events}
              headers={lastHeaders}
            />
            {showDBStates && (
              <DBMain />
            )}
          </Route>
        </Switch>
      </main>
    </ApolloProvider>
  );
}

export default React.memo(ExplorerApp);
