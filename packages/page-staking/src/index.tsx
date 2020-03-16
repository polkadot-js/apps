// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedHeartbeats, DerivedStakingOverview } from '@polkadot/api-derive/types';
import { AppProps as Props } from '@polkadot/react-components/types';
import { AccountId } from '@polkadot/types/interfaces';

import React, { useEffect, useMemo, useReducer, useState } from 'react';
import { Route, Switch } from 'react-router';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { HelpOverlay } from '@polkadot/react-components';
import Tabs from '@polkadot/react-components/Tabs';
import { useAccounts, useApi, useCall, useOwnEraRewards } from '@polkadot/react-hooks';

import basicMd from './md/basic.md';
import Actions from './Actions';
import Overview from './Overview';
import Summary from './Overview/Summary';
import Query from './Query';
import Targets from './Targets';
import { useTranslation } from './translate';

export { default as useCounter } from './useCounter';

function reduceNominators (nominators: string[], additional: string[]): string[] {
  return nominators.concat(...additional.filter((nominator): boolean => !nominators.includes(nominator)));
}

function StakingApp ({ basePath, className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { hasAccounts } = useAccounts();
  const { pathname } = useLocation();
  const { allRewards, rewardCount } = useOwnEraRewards();
  const [next, setNext] = useState<string[] | undefined>();
  const allStashes = useCall<string[]>(api.derive.staking.stashes, [], {
    transform: (stashes: AccountId[]): string[] =>
      stashes.map((accountId): string => accountId.toString())
  });
  const recentlyOnline = useCall<DerivedHeartbeats>(api.derive.imOnline?.receivedHeartbeats, []);
  const stakingOverview = useCall<DerivedStakingOverview>(api.derive.staking.overview, []);
  const [nominators, dispatchNominators] = useReducer(reduceNominators, [] as string[]);
  const hasQueries = useMemo((): boolean => {
    return hasAccounts && !!(api.query.imOnline?.authoredBlocks) && !!(api.query.staking.activeEra);
  }, [api, hasAccounts]);
  const items = useMemo(() => [
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
      text: t('Account actions{{count}}', {
        replace: {
          count: rewardCount
            ? ` (${rewardCount})`
            : ''
        }
      })
    },
    {
      hasParams: true,
      name: 'query',
      text: t('Validator stats')
    }
  ], [rewardCount, t]);
  const hiddenTabs = useMemo((): string[] => {
    const result = next ? [] : ['waiting'];

    if (!hasAccounts) {
      result.push('actions', 'query');
    } else if (!hasQueries) {
      result.push('returns', 'query');
    }

    return result;
  }, [hasAccounts, hasQueries, next]);

  useEffect((): void => {
    allStashes && stakingOverview && setNext(
      allStashes.filter((address): boolean => !stakingOverview.validators.includes(address as any))
    );
  }, [allStashes, stakingOverview?.validators]);

  return (
    <main className={`staking--App ${className}`}>
      <HelpOverlay md={basicMd} />
      <header>
        <Tabs
          basePath={basePath}
          hidden={hiddenTabs}
          items={items}
        />
      </header>
      <Summary
        isVisible={pathname === basePath}
        next={next}
        nominators={nominators}
        stakingOverview={stakingOverview}
      />
      <Switch>
        <Route path={[`${basePath}/query/:value`, `${basePath}/query`]}>
          <Query />
        </Route>
        <Route path={`${basePath}/returns`}>
          <Targets />
        </Route>
      </Switch>
      <Actions
        allRewards={allRewards}
        allStashes={allStashes}
        isVisible={pathname === `${basePath}/actions`}
        next={next}
        stakingOverview={stakingOverview}
      />
      <Overview
        hasQueries={hasQueries}
        isVisible={[basePath, `${basePath}/waiting`].includes(pathname)}
        recentlyOnline={recentlyOnline}
        next={next}
        setNominators={dispatchNominators}
        stakingOverview={stakingOverview}
      />
    </main>
  );
}

export default React.memo(styled(StakingApp)`
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
`);
