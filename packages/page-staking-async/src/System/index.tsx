// Copyright 2017-2025 @polkadot/app-staking-async authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { DeriveStakingOverview, DeriveStakingValidators } from '@polkadot/api-derive/types';
import type { AppProps } from '@polkadot/react-components/types';
import type { ElectionStatus, ParaValidatorIndex, ValidatorId } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';

import React, { useCallback, useMemo, useState } from 'react';
import { Route, Routes } from 'react-router';

import Bags from '@polkadot/app-staking/Bags';
import Payouts from '@polkadot/app-staking/Payouts';
import Query from '@polkadot/app-staking/Query';
import Slashes from '@polkadot/app-staking/Slashes';
import Targets from '@polkadot/app-staking/Targets';
import useNominations from '@polkadot/app-staking/useNominations';
import useSortedTargets from '@polkadot/app-staking/useSortedTargets';
import Pools from '@polkadot/app-staking2/Pools';
import useOwnPools from '@polkadot/app-staking2/Pools/useOwnPools';
import { Tabs } from '@polkadot/react-components';
import { useAccounts, useApi, useAvailableSlashes, useCall, useCallMulti, useFavorites, useOwnStashInfos } from '@polkadot/react-hooks';
import { isFunction } from '@polkadot/util';

import Actions from '../Actions/index.js';
import CommandCenter from '../CommandCenter/index.js';
import { STORE_FAVS_BASE } from '../constants.js';
import { useTranslation } from '../translate.js';
import Validators from '../Validators/index.js';

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

interface Props extends AppProps {
  ahApi?: ApiPromise
  rcApi?: ApiPromise
  isRelayChain: boolean
  rcEndPoints: string[]
  ahEndPoints: string[]
}

function StakingApp ({ ahApi, ahEndPoints, basePath, isRelayChain, rcApi, rcEndPoints }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();

  const [withLedger, setWithLedger] = useState(false);
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS_BASE);
  const [loadNominations, setLoadNominations] = useState(false);
  const { areAccountsLoaded, hasAccounts } = useAccounts();
  const ownStashes = useOwnStashInfos();
  const slashes = useAvailableSlashes();
  const targets = useSortedTargets(favorites, withLedger);
  const [isInElection, minCommission, paraValidators] = useCallMulti<[boolean, BN | undefined, Record<string, boolean>]>([
    api.query.staking.eraElectionStatus,
    api.query.staking.minCommission,
    api.query.session.validators,
    (api.query.parasShared || api.query.shared)?.activeValidatorIndices
  ], OPT_MULTI);
  const nominatedBy = useNominations(loadNominations);
  const ownPools = useOwnPools();
  const ahStakingOverview = useCall<DeriveStakingOverview>(api?.derive.staking.overview);
  const validatorsInfo = useCall<DeriveStakingValidators>(rcApi?.derive.staking.validators);

  const stakingOverview = useMemo(() => (
    !!ahStakingOverview && !!validatorsInfo
      ? {
        ...ahStakingOverview,
        ...validatorsInfo
      }
      : undefined
  ), [ahStakingOverview, validatorsInfo]);

  const toggleNominatedBy = useCallback(
    () => setLoadNominations(true),
    []
  );

  const toggleLedger = useCallback(
    () => setWithLedger(true),
    []
  );

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

  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'active-validators',
      text: t('Active Validators')
    },
    {
      name: 'actions',
      text: t('Accounts')
    },
    hasStashes && isFunction(api.query.staking.activeEra) && {
      name: 'payout',
      text: t('Payouts')
    },
    isFunction(api.query.nominationPools?.minCreateBond) && {
      name: 'pools',
      text: t('Pools')
    },
    {
      alias: 'returns',
      name: 'all-validators',
      text: t('All Validators')
    },
    hasStashes && isFunction((api.query.voterBagsList || api.query.bagsList || api.query.voterList)?.counterForListNodes) && {
      name: 'bags',
      text: t('Bags')
    },
    {
      count: slashes.reduce((count, [, unapplied]) => count + unapplied.length, 0),
      name: 'slashes',
      text: t('Slashes')
    },
    {
      hasParams: true,
      name: 'query',
      text: t('Validator stats')
    },
    {
      name: 'command-center',
      text: t('Command Center')
    }
  ].filter((q): q is { name: string; text: string } => !!q), [api, hasStashes, slashes, t]);

  return (
    <>
      <Tabs
        basePath={basePath}
        hidden={
          areAccountsLoaded && !hasAccounts
            ? HIDDEN_ACC
            : undefined
        }
        items={items}
      />
      <Routes>
        <Route path={basePath}>
          <Route
            element={
              <Bags ownStashes={ownStashes} />
            }
            path='bags'
          />
          <Route
            element={
              <Payouts
                historyDepth={targets.historyDepth}
                isInElection={isInElection}
                ownPools={ownPools}
                ownValidators={ownValidators}
              />
            }
            path='payout'
          />
          <Route
            element={
              <Pools ownPools={ownPools} />
            }
            path='pools'
          />
          <Route
            element={
              <Query basePath={basePath} />
            }
            path='query/:value?'
          />
          <Route
            element={
              <Actions
                isInElection={isInElection}
                minCommission={minCommission}
                ownPools={ownPools}
                ownStashes={ownStashes}
                targets={targets}
              />
            }
            path='actions'
          />
          <Route
            element={
              <Targets
                isInElection={isInElection}
                nominatedBy={nominatedBy}
                ownStashes={ownStashes}
                targets={targets}
                toggleFavorite={toggleFavorite}
                toggleLedger={toggleLedger}
                toggleNominatedBy={toggleNominatedBy}
              />
            }
            path='all-validators'
          />
          <Route
            element={
              <Slashes
                ownStashes={ownStashes}
                slashes={slashes}
              />
            }
            path='slashes'
          />
          <Route
            element={
              <CommandCenter
                ahApi={ahApi}
                ahEndPoints={ahEndPoints}
                isRelayChain={isRelayChain}
                rcApi={rcApi}
                rcEndPoints={rcEndPoints}
              />
            }
            path='command-center'
          />
          <Route
            element={
              <Validators
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
            }
            index
          />
        </Route>
      </Routes>
    </>
  );
}

export default React.memo(StakingApp);
