// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DeriveStakingOverview } from '@polkadot/api-derive/types';
import { AppProps as Props, ThemeProps } from '@polkadot/react-components/types';
import { ElectionStatus } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { HelpOverlay } from '@polkadot/react-components';
import Tabs from '@polkadot/react-components/Tabs';
import { useAccounts, useApi, useAvailableSlashes, useCall, useFavorites, useOwnStashInfos, useStashIds } from '@polkadot/react-hooks';
import { isFunction } from '@polkadot/util';

import basicMd from './md/basic.md';
import Actions from './Actions';
import Overview from './Overview';
import Payouts from './Payouts';
import Query from './Query';
import Summary from './Overview/Summary';
import Slashes from './Slashes';
import Targets from './Targets';
import { STORE_FAVS_BASE } from './constants';
import { useTranslation } from './translate';
import useSortedTargets from './useSortedTargets';

const HIDDEN_ACC = ['actions', 'payouts'];

const transformElection = {
  transform: (status: ElectionStatus) => status.isOpen
};

function StakingApp ({ basePath, className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { hasAccounts } = useAccounts();
  const { pathname } = useLocation();
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS_BASE);
  const allStashes = useStashIds();
  const ownStashes = useOwnStashInfos();
  const slashes = useAvailableSlashes();
  const targets = useSortedTargets(favorites);
  const stakingOverview = useCall<DeriveStakingOverview>(api.derive.staking.overview);
  const isInElection = useCall<boolean>(api.query.staking?.eraElectionStatus, undefined, transformElection);

  const hasQueries = useMemo(
    () => hasAccounts && !!(api.query.imOnline?.authoredBlocks) && !!(api.query.staking.activeEra),
    [api, hasAccounts]
  );

  const next = useMemo(
    () => (allStashes && stakingOverview)
      ? allStashes.filter((address) => !stakingOverview.validators.includes(address as any))
      : undefined,
    [allStashes, stakingOverview]
  );

  const ownValidators = useMemo(
    () => (ownStashes || []).filter(({ isStashValidating }) => isStashValidating),
    [ownStashes]
  );

  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'overview',
      text: t<string>('Staking overview')
    },
    {
      name: 'actions',
      text: t<string>('Account actions')
    },
    isFunction(api.query.staking.activeEra)
      ? {
        name: 'payout',
        text: t<string>('Payouts')
      }
      : null,
    {
      alias: 'returns',
      name: 'targets',
      text: t<string>('Targets')
    },
    {
      name: 'waiting',
      text: t<string>('Waiting')
    },
    {
      count: slashes.reduce((count, [, unapplied]) => count + unapplied.length, 0),
      name: 'slashes',
      text: t<string>('Slashes')
    },
    {
      hasParams: true,
      name: 'query',
      text: t<string>('Validator stats')
    }
  ].filter((q): q is { name: string; text: string } => !!q), [api, slashes, t]);

  return (
    <main className={`staking--App ${className}`}>
      <HelpOverlay md={basicMd as string} />
      <header>
        <Tabs
          basePath={basePath}
          hidden={
            hasAccounts
              ? undefined
              : HIDDEN_ACC
          }
          items={items}
        />
      </header>
      <Summary
        isVisible={pathname === basePath}
        next={next}
        nominators={targets.nominators}
        stakingOverview={stakingOverview}
      />
      <Switch>
        <Route path={`${basePath}/payout`}>
          <Payouts
            isInElection={isInElection}
            ownValidators={ownValidators}
          />
        </Route>
        <Route path={[`${basePath}/query/:value`, `${basePath}/query`]}>
          <Query />
        </Route>
        <Route path={`${basePath}/slashes`}>
          <Slashes
            ownStashes={ownStashes}
            slashes={slashes}
          />
        </Route>
        <Route path={`${basePath}/targets`}>
          <Targets
            isInElection={isInElection}
            ownStashes={ownStashes}
            stakingOverview={stakingOverview}
            targets={targets}
            toggleFavorite={toggleFavorite}
          />
        </Route>
        <Route path={`${basePath}/waiting`}>
          <Overview
            favorites={favorites}
            hasQueries={hasQueries}
            isIntentions
            next={next}
            stakingOverview={stakingOverview}
            targets={targets}
            toggleFavorite={toggleFavorite}
          />
        </Route>
      </Switch>
      <Actions
        className={pathname === `${basePath}/actions` ? '' : 'staking--hidden'}
        isInElection={isInElection}
        ownStashes={ownStashes}
        targets={targets}
      />
      <Overview
        className={basePath === pathname ? '' : 'staking--hidden'}
        favorites={favorites}
        hasQueries={hasQueries}
        next={next}
        stakingOverview={stakingOverview}
        targets={targets}
        toggleFavorite={toggleFavorite}
      />
    </main>
  );
}

export default React.memo(styled(StakingApp)(({ theme }: ThemeProps) => `
  .staking--hidden {
    display: none;
  }

  .staking--Chart {
    margin-top: 1.5rem;

    h1 {
      margin-bottom: 0.5rem;
    }

    .ui--Spinner {
      margin: 2.5rem auto;
    }
  }

  .staking--optionsBar {
    text-align: right;

    .staking--buttonToggle {
      display: inline-block;
      margin-right: 1rem;
      margin-top: 0.5rem;
    }
  }

  .ui--Expander.stakeOver {
    .ui--Expander-summary {
      color: ${theme.colorError};
    }
  }
`));
