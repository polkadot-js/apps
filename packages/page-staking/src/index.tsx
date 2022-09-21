// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveStakingOverview } from '@polkadot/api-derive/types';
import type { AppProps as Props, ThemeProps } from '@polkadot/react-components/types';
import type { ElectionStatus, ParaValidatorIndex, ValidatorId } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';

import React, { useCallback, useMemo, useRef, useState } from 'react';
import { Route, Switch } from 'react-router';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import PerformancePage from '@polkadot/app-staking/Performance';
import { HelpOverlay, Tabs } from '@polkadot/react-components';
import { useAccounts, useApi, useAvailableSlashes, useCall, useCallMulti, useFavorites, useOwnStashInfos } from '@polkadot/react-hooks';
import { isFunction } from '@polkadot/util';

import basicMd from './md/basic.md';
import Actions from './Actions';
import Bags from './Bags';
import { STORE_FAVS_BASE } from './constants';
import Payouts from './Payouts';
import Pools from './Pools';
import Query from './Query';
import Slashes from './Slashes';
import Targets from './Targets';
import { useTranslation } from './translate';
import useNominations from './useNominations';
import useOwnPools from './useOwnPools';
import useSortedTargets from './useSortedTargets';
import Validators from './Validators';

const HIDDEN_ACC = ['actions', 'payout'];

const OPT_MULTI = {
  defaultValue: [false, undefined, {}] as [boolean, BN | undefined, Record<string, boolean>],
  transform: ([eraElectionStatus, minValidatorBond, validators, activeValidatorIndices]: [ElectionStatus | null, BN | undefined, ValidatorId[] | null, ParaValidatorIndex[] | null]): [boolean, BN | undefined, Record<string, boolean>] => [
    !!eraElectionStatus && eraElectionStatus.isOpen,
    minValidatorBond && !minValidatorBond.isZero()
      ? minValidatorBond
      : undefined,
    validators && activeValidatorIndices
      ? activeValidatorIndices.reduce((all, index) => ({ ...all, [validators[index.toNumber()].toString()]: true }), {})
      : {}
  ]
};

function createPathRef (basePath: string): Record<string, string | string[]> {
  return {
    bags: `${basePath}/bags`,
    payout: `${basePath}/payout`,
    performance: `${basePath}/performance`,
    pools: `${basePath}/pools`,
    query: [
      `${basePath}/query/:value`,
      `${basePath}/query`
    ],
    slashes: `${basePath}/slashes`,
    targets: `${basePath}/targets`
  };
}

function StakingApp ({ basePath, className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { areAccountsLoaded, hasAccounts } = useAccounts();
  const { pathname } = useLocation();
  const [withLedger, setWithLedger] = useState(false);
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS_BASE);
  const [loadNominations, setLoadNominations] = useState(false);
  const nominatedBy = useNominations(loadNominations);
  const stakingOverview = useCall<DeriveStakingOverview>(api.derive.staking.overview);
  const [isInElection, minCommission, paraValidators] = useCallMulti<[boolean, BN | undefined, Record<string, boolean>]>([
    api.query.staking.eraElectionStatus,
    api.query.staking.minCommission,
    api.query.session.validators,
    (api.query.parasShared || api.query.shared)?.activeValidatorIndices
  ], OPT_MULTI);
  const ownPools = useOwnPools();
  const ownStashes = useOwnStashInfos();
  const slashes = useAvailableSlashes();
  const targets = useSortedTargets(favorites, withLedger);
  const pathRef = useRef(createPathRef(basePath));

  const hasQueries = useMemo(
    () => hasAccounts && !!(api.query.imOnline?.authoredBlocks) && !!(api.query.staking.activeEra),
    [api, hasAccounts]
  );

  const hasStashes = useMemo(
    () => hasAccounts && !!ownStashes && (ownStashes.length !== 0),
    [hasAccounts, ownStashes]
  );

  const ownValidators = useMemo(
    () => (ownStashes || []).filter(({ isStashValidating }) => isStashValidating),
    [ownStashes]
  );

  const toggleLedger = useCallback(
    () => setWithLedger(true),
    []
  );

  const toggleNominatedBy = useCallback(
    () => setLoadNominations(true),
    []
  );

  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'overview',
      text: t<string>('Overview')
    },
    {
      name: 'actions',
      text: t<string>('Accounts')
    },
    hasStashes && isFunction(api.query.staking.activeEra) && {
      name: 'payout',
      text: t<string>('Payouts')
    },
    isFunction(api.query.nominationPools?.minCreateBond) && {
      name: 'pools',
      text: t<string>('Pools')
    },
    {
      alias: 'returns',
      name: 'targets',
      text: t<string>('Targets')
    },
    hasStashes && isFunction((api.query.bagsList || api.query.voterList)?.counterForListNodes) && {
      name: 'bags',
      text: t<string>('Bags')
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
    },
    {
      name: 'performance',
      text: t<string>('Performance')
    }
  ].filter((q): q is { name: string; text: string } => !!q), [api, hasStashes, slashes, t]);

  return (
    <main className={`staking--App ${className}`}>
      <HelpOverlay md={basicMd as string} />
      <Tabs
        basePath={basePath}
        hidden={
          areAccountsLoaded && !hasAccounts
            ? HIDDEN_ACC
            : undefined
        }
        items={items}
      />
      <Switch>
        <Route path={pathRef.current.bags}>
          <Bags ownStashes={ownStashes} />
        </Route>
        <Route path={pathRef.current.payout}>
          <Payouts
            historyDepth={targets.historyDepth}
            isInElection={isInElection}
            ownPools={ownPools}
            ownValidators={ownValidators}
          />
        </Route>
        <Route path={pathRef.current.pools}>
          <Pools ownPools={ownPools} />
        </Route>
        <Route path={pathRef.current.query}>
          <Query />
        </Route>
        <Route path={pathRef.current.slashes}>
          <Slashes
            ownStashes={ownStashes}
            slashes={slashes}
          />
        </Route>
        <Route path={pathRef.current.targets}>
          <Targets
            isInElection={isInElection}
            nominatedBy={nominatedBy}
            ownStashes={ownStashes}
            stakingOverview={stakingOverview}
            targets={targets}
            toggleFavorite={toggleFavorite}
            toggleLedger={toggleLedger}
            toggleNominatedBy={toggleNominatedBy}
          />
        </Route>
        <Route path={pathRef.current.performance}>
          <PerformancePage/>
        </Route>
      </Switch>
      <Actions
        className={pathname === `${basePath}/actions` ? '' : '--hidden'}
        isInElection={isInElection}
        minCommission={minCommission}
        ownPools={ownPools}
        ownStashes={ownStashes}
        targets={targets}
      />
      <Validators
        className={basePath === pathname ? '' : '--hidden'}
        favorites={favorites}
        hasAccounts={hasAccounts}
        hasQueries={hasQueries}
        minCommission={minCommission}
        nominatedBy={nominatedBy}
        ownStashes={ownStashes}
        paraValidators={paraValidators}
        stakingOverview={stakingOverview}
        targets={targets}
        toggleFavorite={toggleFavorite}
        toggleNominatedBy={toggleNominatedBy}
      />
    </main>
  );
}

export default React.memo(styled(StakingApp)(({ theme }: ThemeProps) => `
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
    margin: 0.5rem 0 1rem;
    text-align: center;
    white-space: normal;

    .staking--buttonToggle {
      display: inline-block;
      margin-right: 1rem;
      margin-top: 0.5rem;
    }
  }

 .performance--actionrow {
    align-items: flex-start;
    display: flex;

    .ui--Button {
      margin: 0.25rem;
    }

    &.head {
      flex: 1 1 100%;
      margin: 0 auto;
      max-width: 620px;
    }
  }

  .performance--actionrow-value {
    flex: 1;
    min-width: 0;

    .ui--output {
      word-break: break-all;
    }
  }

  .performance--actionrow-buttons {
    flex: 0;
    padding: 0.5rem 0.25rem;
  }

  .ui--Expander.stakeOver {
    .ui--Expander-summary {
      color: var(--color-error);

    ${theme.theme === 'dark'
    ? `font-weight: bold;
      .ui--FormatBalance-value {

        > .ui--FormatBalance-postfix {
          opacity: 1;
        }
      }`
    : ''};
    }
  }
`));
