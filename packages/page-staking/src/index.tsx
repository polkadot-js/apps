// Copyright 2017-2024 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AppProps as Props } from '@polkadot/react-components/types';
import type { ElectionStatus, ParaValidatorIndex, ValidatorId } from '@polkadot/types/interfaces';
import type { BN } from '@polkadot/util';

import React, { useMemo, useState } from 'react';
import { Route, Routes } from 'react-router';
import { useLocation } from 'react-router-dom';

import {styled, Tabs} from '@polkadot/react-components';
import {
  useAccounts,
  useApi,
  useCallMulti,
  useFavorites,
} from '@polkadot/react-hooks';
import Validators from './Validators/index.js';
import { STORE_FAVS_BASE } from './constants.js';
import { useTranslation } from './translate.js';
import UserNomination from './UserNomination';
import {useGetValidators} from './useGetValidators'
import { ValidatorSlashed } from './ValidatorSlashed';

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

function StakingApp ({ basePath, onStatusChange, className = '' }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { areAccountsLoaded, hasAccounts, allAccounts } = useAccounts();
  const { pathname } = useLocation();
  const [withLedger, setWithLedger] = useState(false);
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS_BASE);
  // const [loadNominations, setLoadNominations] = useState(false);
  // const nominatedBy = useNominations(loadNominations);
  // const stakingOverview = useCall<DeriveStakingOverview>(api.derive.staking.overview);
  const [paraValidators] = useCallMulti<[boolean, BN | undefined, Record<string, boolean>]>([
    api.query.session.validators,
    (api.query.parasShared || api.query.shared)?.activeValidatorIndices
  ], OPT_MULTI);
  // const ownPools = useOwnPools();
  // const ownStashes = useOwnStashInfos();
  // const slashes = useAvailableSlashes();
  // const targets = useSortedTargets(favorites, withLedger);
  // const [validatorInfoList, setValidatorInfoList] = useState<ValidatorInfo[]>([]);
  const { data: validatorInfoList, refetch: refetchValidatorInfoList } = useGetValidators()

  // const hasStashes = useMemo(
  //   () => hasAccounts && !!ownStashes && (ownStashes.length !== 0),
  //   [hasAccounts, ownStashes]
  // );

  // const ownValidators = useMemo(
  //   () => (ownStashes || []).filter(({ isStashValidating }) => isStashValidating),
  //   [ownStashes]
  // );

  // const toggleLedger = useCallback(
  //   () => setWithLedger(true),
  //   []
  // );

  // const toggleNominatedBy = useCallback(
  //   () => setLoadNominations(true),
  //   []
  // );

  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'overview',
      text: t('Overview')
    },
    {
      name: 'actions',
      text: t('Accounts')
    },
    {
      name: 'slashed',
      text: t('Slashed')
    },
  ].filter((q): q is { name: string; text: string } => !!q), [api, t]);

  const stakingOverview = {
    validators: validatorInfoList.map(item => item.account),
    accounts: allAccounts,
    validatorCount: validatorInfoList.filter(item => item.isValidating).length,
    candidateorDrop: validatorInfoList.filter(i => allAccounts.includes(i.account!))
  }

  return (
    <StyledMain className={`${className} staking--App`}>
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
          <Route path={'actions'} element={(
            <UserNomination
              validatorInfoList={validatorInfoList}
              onVoteSuccess={refetchValidatorInfoList}
            />
          )}/>
          <Route path={'slashed'} element={<ValidatorSlashed />}/>

          {/*<Route*/}
          {/*  element={*/}
          {/*    <Bags ownStashes={ownStashes} />*/}
          {/*  }*/}
          {/*  path='bags'*/}
          {/*/>*/}
          {/*<Route*/}
          {/*  element={*/}
          {/*    <Targets*/}
          {/*      nominatedBy={nominatedBy}*/}
          {/*      ownStashes={ownStashes}*/}
          {/*      stakingOverview={stakingOverview}*/}
          {/*      targets={targets}*/}
          {/*      toggleFavorite={toggleFavorite}*/}
          {/*      toggleLedger={toggleLedger}*/}
          {/*      toggleNominatedBy={toggleNominatedBy}*/}
          {/*    />*/}
          {/*  }*/}
          {/*  path='targets'*/}
          {/*/>*/}
        </Route>
      </Routes>

      {/*<Actions*/}
      {/*  className={pathname === `${basePath}/actions` ? '' : '--hidden'}*/}
      {/*  isInElection={false}*/}
      {/*  minCommission={undefined}*/}
      {/*  ownPools={ownPools}*/}
      {/*  // ownStashes={ownStashes}*/}
      {/*  targets={targets}*/}
      {/*/>*/}
      <Validators
        className={basePath === pathname ? '' : '--hidden'}
        favorites={favorites}
        hasAccounts={hasAccounts}
        hasQueries={false}
        minCommission={undefined}
        // nominatedBy={nominatedBy}
        // ownStashes={ownStashes}
        paraValidators={paraValidators}
        stakingOverview={stakingOverview}
        targets={validatorInfoList}
        toggleFavorite={toggleFavorite}
        onVoteSuccess={refetchValidatorInfoList}
        // toggleNominatedBy={toggleNominatedBy}
      />
    </StyledMain>
  );
}

const StyledMain = styled.main`
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

  .ui--Expander.stakeOver {
    .ui--Expander-summary {
      color: var(--color-error);
    }
  }
`;

export default React.memo(StakingApp);
