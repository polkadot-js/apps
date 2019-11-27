// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedHeartbeats, DerivedStakingOverview } from '@polkadot/api-derive/types';
import { AppProps, I18nProps } from '@polkadot/react-components/types';
import { AccountId, BlockNumber } from '@polkadot/types/interfaces';
import { ComponentProps } from './types';

import React from 'react';
import { Route, Switch } from 'react-router';
import { useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
import { Option } from '@polkadot/types';
import { HelpOverlay } from '@polkadot/react-components';
import Tabs from '@polkadot/react-components/Tabs';
import { trackStream, useAccounts, useApi } from '@polkadot/react-hooks';

import basicMd from './md/basic.md';
import Actions from './Actions';
import Overview from './Overview';
import Query from './Query';
import Targets from './Targets';
import { MAX_SESSIONS } from './constants';
import translate from './translate';
import useSessionRewards from './useSessionRewards';

interface Props extends AppProps, I18nProps {
}

const EMPY_ACCOUNTS: string[] = [];
const EMPTY_ALL: [string[], string[]] = [EMPY_ACCOUNTS, EMPY_ACCOUNTS];

function transformStakingControllers ([stashes, controllers]: [AccountId[], Option<AccountId>[]]): [string[], string[]] {
  return [
    stashes.map((accountId): string => accountId.toString()),
    controllers
      .filter((optId): boolean => optId.isSome)
      .map((accountId): string => accountId.unwrap().toString())
  ];
}

function App ({ basePath, className, t }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const { allAccounts, hasAccounts } = useAccounts();
  const stakingControllers = trackStream<[string[], string[]]>(api.derive.staking.controllers, [], { transform: transformStakingControllers });
  const bestNumber = trackStream<BlockNumber>(api.derive.chain.bestNumber, []);
  const recentlyOnline = trackStream<DerivedHeartbeats>(api.derive.imOnline.receivedHeartbeats, []);
  const stakingOverview = trackStream<DerivedStakingOverview>(api.derive.staking.overview, []);
  const sessionRewards = useSessionRewards(MAX_SESSIONS);
  const routeMatch = useRouteMatch({ path: basePath, strict: true });

  const hasQueries = hasAccounts && !!(api.query.imOnline?.authoredBlocks);
  const [allStashes, allControllers] = stakingControllers || EMPTY_ALL;
  const _renderComponent = (Component: React.ComponentType<ComponentProps>, className?: string): React.ReactNode => (
    <Component
      allAccounts={allAccounts}
      allControllers={allControllers}
      allStashes={allStashes}
      bestNumber={bestNumber}
      className={className}
      hasAccounts={hasAccounts}
      hasQueries={hasQueries}
      recentlyOnline={recentlyOnline}
      sessionRewards={sessionRewards}
      stakingOverview={stakingOverview}
    />
  );

  return (
    <main className={`staking--App ${className}`}>
      <HelpOverlay md={basicMd} />
      <header>
        <Tabs
          basePath={basePath}
          hidden={
            hasAccounts
              ? hasQueries
                ? []
                : ['query']
              : ['actions', 'query']
          }
          items={[
            {
              isRoot: true,
              name: 'overview',
              text: t('Staking overview')
            },
            {
              name: 'actions',
              text: t('Account actions')
            },
            {
              name: 'returns',
              text: t('Returns')
            },
            {
              hasParams: true,
              name: 'query',
              text: t('Validator stats')
            }
          ]}
        />
      </header>
      <Switch>
        <Route path={`${basePath}/actions`}>{_renderComponent(Actions)}</Route>
        <Route path={`${basePath}/query/:value`}>{_renderComponent(Query)}</Route>
        <Route path={`${basePath}/query`}>{_renderComponent(Query)}</Route>
        <Route path={`${basePath}/returns`}>{_renderComponent(Targets)}</Route>
      </Switch>
      {_renderComponent(Overview, routeMatch?.isExact ? '' : 'staking--hidden')}
    </main>
  );
}

export default translate(
  styled(App)`
    .staking--hidden {
      display: none;
    }

    .staking--queryInput {
      margin-bottom: 1.5rem;
    }

    .staking--Chart h1 {
      margin-bottom: 0.5rem;
    }

    .staking--Chart+.staking--Chart {
      margin-top: 1.5rem;
    }
  `
);
