// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedHeartbeats, DerivedStakingOverview } from '@polkadot/api-derive/types';
import { AppProps, I18nProps } from '@polkadot/react-components/types';
import { ApiProps } from '@polkadot/react-api/types';
import { AccountId, BlockNumber } from '@polkadot/types/interfaces';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { ComponentProps } from './types';

import React, { useContext } from 'react';
import { Route, Switch } from 'react-router';
import { useRouteMatch } from 'react-router-dom';
import styled from 'styled-components';
import { Option } from '@polkadot/types';
import { HelpOverlay } from '@polkadot/react-components';
import Tabs from '@polkadot/react-components/Tabs';
import { ApiContext, withCalls, withMulti, withObservable } from '@polkadot/react-api';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';

import Accounts from './Actions/Accounts';
import basicMd from './md/basic.md';
import Overview from './Overview';
import Query from './Query';
import translate from './translate';

interface Props extends AppProps, ApiProps, I18nProps {
  allAccounts?: SubjectInfo;
  allStashesAndControllers?: [string[], string[]];
  bestNumber?: BlockNumber;
  recentlyOnline?: DerivedHeartbeats;
  stakingOverview?: DerivedStakingOverview;
}

const EMPY_ACCOUNTS: string[] = [];
const EMPTY_ALL: [string[], string[]] = [EMPY_ACCOUNTS, EMPY_ACCOUNTS];

function App ({ allAccounts, allStashesAndControllers: [allStashes, allControllers] = EMPTY_ALL, basePath, className, recentlyOnline, stakingOverview, t }: Props): React.ReactElement<Props> {
  const { api } = useContext(ApiContext);
  const routeMatch = useRouteMatch({ path: basePath, strict: true });
  const _renderComponent = (Component: React.ComponentType<ComponentProps>, className?: string): () => React.ReactNode => {
    // eslint-disable-next-line react/display-name
    return (): React.ReactNode => {
      if (!allAccounts) {
        return null;
      }

      return (
        <Component
          allAccounts={allAccounts}
          allControllers={allControllers}
          allStashes={allStashes}
          className={className}
          recentlyOnline={recentlyOnline}
          stakingOverview={stakingOverview}
        />
      );
    };
  };

  return (
    <main className={`staking--App ${className}`}>
      <HelpOverlay md={basicMd} />
      <header>
        <Tabs
          basePath={basePath}
          hidden={
            !allAccounts || Object.keys(allAccounts).length === 0
              ? ['actions', 'query']
              : api.query.imOnline?.authoredBlocks
                ? []
                : ['query']
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
              hasParams: true,
              name: 'query',
              text: t('Validator stats')
            }
          ]}
        />
      </header>
      <Switch>
        <Route path={`${basePath}/actions`} render={_renderComponent(Accounts)} />
        <Route path={`${basePath}/query/:value`} render={_renderComponent(Query)} />
        <Route path={`${basePath}/query`} render={_renderComponent(Query)} />
      </Switch>
      {_renderComponent(Overview, routeMatch?.isExact ? '' : 'staking--hidden')()}
    </main>
  );
}

export default withMulti(
  styled(App)`
    .staking--hidden {
      display: none;
    }

    .staking--queryInput {
      margin-bottom: 1.5rem;
    }
  `,
  translate,
  withCalls<Props>(
    ['derive.imOnline.receivedHeartbeats', { propName: 'recentlyOnline' }],
    ['derive.staking.controllers', {
      propName: 'allStashesAndControllers',
      transform: ([stashes, controllers]: [AccountId[], Option<AccountId>[]]): [string[], string[]] => [
        stashes.map((accountId): string => accountId.toString()),
        controllers
          .filter((optId): boolean => optId.isSome)
          .map((accountId): string => accountId.unwrap().toString())
      ]
    }],
    ['derive.staking.overview', { propName: 'stakingOverview' }]
  ),
  withObservable(accountObservable.subject, { propName: 'allAccounts' })
);
