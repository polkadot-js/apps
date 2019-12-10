// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedHeartbeats, DerivedStakingOverview } from '@polkadot/api-derive/types';
import { AppProps, I18nProps } from '@polkadot/react-components/types';
import { AccountId } from '@polkadot/types/interfaces';

import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Option } from '@polkadot/types';
import { HelpOverlay } from '@polkadot/react-components';
import Tabs from '@polkadot/react-components/Tabs';
import { useCall, useAccounts, useApi } from '@polkadot/react-hooks';

import basicMd from './md/basic.md';
import Actions from './Actions';
import Overview from './Overview';
import Summary from './Overview/Summary';
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
  const { api, isSubstrateV2 } = useApi();
  const { hasAccounts } = useAccounts();
  const { pathname } = useLocation();
  const [next, setNext] = useState<string[]>([]);
  const [allStashes, allControllers] = (useCall<[string[], string[]]>(api.derive.staking.controllers, [], {
    defaultValue: EMPTY_ALL,
    transform: transformStakingControllers
  }) as [string[], string[]]);
  const recentlyOnline = useCall<DerivedHeartbeats>(api.derive.imOnline.receivedHeartbeats, []);
  const stakingOverview = useCall<DerivedStakingOverview>(api.derive.staking.overview, []);
  const sessionRewards = useSessionRewards(MAX_SESSIONS);
  const hasQueries = hasAccounts && !!(api.query.imOnline?.authoredBlocks);
  const validators = stakingOverview?.validators;

  useEffect((): void => {
    validators && setNext(
      isSubstrateV2
        // this is a V2 node currentValidators is a list of stashes
        ? allStashes.filter((address): boolean => !validators.includes(address as any))
        // this is a V1 node currentValidators is a list of controllers
        : allControllers.filter((address): boolean => !validators.includes(address as any))
    );
  }, [allControllers, allStashes, validators]);

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
              name: 'waiting',
              text: t('Waiting')
            },
            {
              name: 'returns',
              text: t('Returns')
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
      <Summary
        isVisible={pathname === basePath}
        next={next}
        stakingOverview={stakingOverview}
      />
      <Switch>
        <Route path={[`${basePath}/query/:value`, `${basePath}/query`]}>
          <Query sessionRewards={sessionRewards} />
        </Route>
        <Route path={`${basePath}/returns`}>
          <Targets sessionRewards={sessionRewards} />
        </Route>
      </Switch>
      <Actions
        allStashes={allStashes}
        isVisible={pathname === `${basePath}/actions`}
        recentlyOnline={recentlyOnline}
        next={next}
        stakingOverview={stakingOverview}
      />
      <Overview
        hasQueries={hasQueries}
        isVisible={[basePath, `${basePath}/waiting`].includes(pathname)}
        recentlyOnline={recentlyOnline}
        next={next}
        stakingOverview={stakingOverview}
      />
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
