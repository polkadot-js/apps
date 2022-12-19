// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveHasIdentity, DeriveStakingOverview } from '@polkadot/api-derive/types';
import type { StakerState } from '@polkadot/react-hooks/types';
import type { u32 } from '@polkadot/types-codec';
import type { NominatedByMap, SortedTargets, TargetSortBy, ValidatorInfo } from '../types';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

import { Button, Icon, Table, Toggle } from '@polkadot/react-components';
import { useApi, useAvailableSlashes, useSavedFlags } from '@polkadot/react-hooks';

import { MAX_NOMINATIONS } from '../constants';
import ElectionBanner from '../ElectionBanner';
import Filtering from '../Filtering';
import Legend from '../Legend';
import { useTranslation } from '../translate';
import useIdentities from '../useIdentities';
import Nominate from './Nominate';
import Summary from './Summary';
import useOwnNominators from './useOwnNominators';
import Validator from './Validator';

interface Props {
  className?: string;
  isInElection: boolean;
  nominatedBy?: NominatedByMap;
  ownStashes?: StakerState[];
  stakingOverview?: DeriveStakingOverview;
  targets: SortedTargets;
  toggleFavorite: (address: string) => void;
  toggleLedger: () => void;
  toggleNominatedBy: () => void;
}

interface SavedFlags {
  withElected: boolean;
  withIdentity: boolean;
}

interface SortState {
  sortBy: TargetSortBy;
  sortFromMax: boolean;
}

const CLASSES: Record<string, string> = {
  rankBondOther: 'media--1600',
  rankBondOwn: 'media--900'
};
const SORT_KEYS = ['rankBondTotal', 'rankBondOwn', 'rankBondOther', 'rankOverall'];

function applyFilter (validators: ValidatorInfo[], allIdentity: Record<string, DeriveHasIdentity>, { withElected, withIdentity }: SavedFlags): ValidatorInfo[] {
  return validators.filter(({ accountId, isElected, isFavorite }): boolean => {
    const stashId = accountId.toString();
    const thisIdentity = allIdentity[stashId];

    return isFavorite ||
      ((!withElected || isElected) &&
      (!withIdentity || !!thisIdentity?.hasIdentity));
  });
}

function sort (sortBy: TargetSortBy, sortFromMax: boolean, validators: ValidatorInfo[]): ValidatorInfo[] {
  // Use slice to create new array, so that sorting triggers component render
  return validators
    .slice(0)
    .sort((a, b) =>
      sortFromMax
        ? a[sortBy] - b[sortBy]
        : b[sortBy] - a[sortBy]
    )
    .sort((a, b) =>
      a.isFavorite === b.isFavorite
        ? 0
        : (a.isFavorite ? -1 : 1)
    );
}

function extractNominees (ownNominators: StakerState[] = []): string[] {
  const myNominees: string[] = [];

  ownNominators.forEach(({ nominating = [] }: StakerState): void => {
    nominating.forEach((nominee: string): void => {
      !myNominees.includes(nominee) &&
        myNominees.push(nominee);
    });
  });

  return myNominees;
}

function selectProfitable (list: ValidatorInfo[], maxNominations: number): string[] {
  const result: string[] = [];

  for (let i = 0; i < list.length && result.length < maxNominations; i++) {
    const { isBlocking, isFavorite, key, stakedReturnCmp } = list[i];

    (!isBlocking && (isFavorite || (stakedReturnCmp > 0))) &&
      result.push(key);
  }

  return result;
}

const DEFAULT_FLAGS = {
  withElected: false,
  withIdentity: false
};

const DEFAULT_NAME = { isQueryFiltered: false, nameFilter: '' };

const DEFAULT_SORT: SortState = { sortBy: 'rankOverall', sortFromMax: true };

function Targets ({ className = '', isInElection, nominatedBy, ownStashes, targets: { avgStaked, inflation: { stakedReturn }, lastEra, lowStaked, minNominated, minNominatorBond, nominators, totalIssuance, totalStaked, validatorIds, validators }, toggleFavorite, toggleLedger, toggleNominatedBy }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const allSlashes = useAvailableSlashes();
  const ownNominators = useOwnNominators(ownStashes);
  const allIdentity = useIdentities(validatorIds);
  const [selected, setSelected] = useState<string[]>([]);
  const [{ isQueryFiltered, nameFilter }, setNameFilter] = useState(DEFAULT_NAME);
  const [toggles, setToggle] = useSavedFlags('staking:targets', DEFAULT_FLAGS);
  const [{ sortBy, sortFromMax }, setSortBy] = useState<SortState>(DEFAULT_SORT);
  const [sorted, setSorted] = useState<ValidatorInfo[] | undefined>();

  const labelsRef = useRef({
    rankBondOther: t<string>('other stake'),
    rankBondOwn: t<string>('own stake'),
    rankBondTotal: t<string>('total stake'),
    rankOverall: t<string>('return')
  });

  const flags = useMemo(
    () => ({
      ...toggles,
      isQueryFiltered
    }),
    [isQueryFiltered, toggles]
  );

  const filtered = useMemo(
    () => allIdentity && validators && applyFilter(validators, allIdentity, flags),
    [allIdentity, flags, validators]
  );

  // We are using an effect here to get this async. Sorting will have a double-render, however it allows
  // the page to immediately display (with loading), whereas useMemo would have a laggy interface
  // (the same applies for changing the sort order, state here is more effective)
  useEffect((): void => {
    filtered && setSorted(
      sort(sortBy, sortFromMax, filtered)
    );
  }, [filtered, sortBy, sortFromMax]);

  useEffect((): void => {
    toggleLedger();
    toggleNominatedBy();
  }, [toggleLedger, toggleNominatedBy]);

  const maxNominations = useMemo(
    () => api.consts.staking.maxNominations
      ? (api.consts.staking.maxNominations as u32).toNumber()
      : MAX_NOMINATIONS,
    [api]
  );

  const myNominees = useMemo(
    () => extractNominees(ownNominators),
    [ownNominators]
  );

  const _sort = useCallback(
    (sortBy: TargetSortBy) => setSortBy((p) => ({
      sortBy,
      sortFromMax: sortBy === p.sortBy
        ? !p.sortFromMax
        : true
    })),
    []
  );

  const _toggleSelected = useCallback(
    (address: string) => setSelected(
      selected.includes(address)
        ? selected.filter((a) => address !== a)
        : [...selected, address]
    ),
    [selected]
  );

  const _selectProfitable = useCallback(
    () => filtered && setSelected(
      selectProfitable(filtered, maxNominations)
    ),
    [filtered, maxNominations]
  );

  const _setNameFilter = useCallback(
    (nameFilter: string, isQueryFiltered: boolean) => setNameFilter({ isQueryFiltered, nameFilter }),
    []
  );

  const header = useMemo(() => [
    [t('validators'), 'start', 3],
    [t('last era payout'), 'media--1400'],
    [t('nominators'), 'media--1200', 2],
    [t('comm.'), 'media--1100'],
    ...(SORT_KEYS as (keyof typeof labelsRef.current)[]).map((header) => [
      <>{labelsRef.current[header]}<Icon icon={sortBy === header ? (sortFromMax ? 'chevron-down' : 'chevron-up') : 'minus'} /></>,
      `${sorted ? `isClickable ${sortBy === header ? 'highlight--border' : ''} number` : 'number'} ${CLASSES[header] || ''}`,
      1,
      () => _sort(header as 'rankOverall')
    ]),
    [],
    []
  ], [_sort, labelsRef, sortBy, sorted, sortFromMax, t]);

  const filter = useMemo(() => (
    <div>
      <Filtering
        nameFilter={nameFilter}
        setNameFilter={_setNameFilter}
        setWithIdentity={setToggle.withIdentity}
        withIdentity={toggles.withIdentity}
      >
        <Toggle
          className='staking--buttonToggle'
          label={t<string>('currently elected')}
          onChange={setToggle.withElected}
          value={toggles.withElected}
        />
      </Filtering>
    </div>
  ), [nameFilter, _setNameFilter, setToggle, t, toggles]);

  const displayList = isQueryFiltered
    ? validators
    : sorted;
  const canSelect = selected.length < maxNominations;

  return (
    <div className={className}>
      <Summary
        avgStaked={avgStaked}
        lastEra={lastEra}
        lowStaked={lowStaked}
        minNominated={minNominated}
        minNominatorBond={minNominatorBond}
        numNominators={nominators?.length}
        numValidators={validators?.length}
        stakedReturn={stakedReturn}
        totalIssuance={totalIssuance}
        totalStaked={totalStaked}
      />
      <Button.Group>
        <Button
          icon='check'
          isDisabled={!validators?.length || !ownNominators?.length}
          label={t<string>('Most profitable')}
          onClick={_selectProfitable}
        />
        <Nominate
          isDisabled={isInElection || !validators?.length}
          ownNominators={ownNominators}
          targets={selected}
        />
      </Button.Group>
      <ElectionBanner isInElection={isInElection} />
      <Table
        empty={sorted && t<string>('No active validators to check')}
        emptySpinner={
          <>
            {!(validators && allIdentity) && <div>{t('Retrieving validators')}</div>}
            {!nominatedBy && <div>{t('Retrieving nominators')}</div>}
            {!displayList && <div>{t('Preparing target display')}</div>}
          </>
        }
        filter={filter}
        header={header}
        legend={<Legend />}
      >
        {displayList && displayList.map((info): React.ReactNode =>
          <Validator
            allSlashes={allSlashes}
            canSelect={canSelect}
            filterName={nameFilter}
            info={info}
            isNominated={myNominees.includes(info.key)}
            isSelected={selected.includes(info.key)}
            key={info.key}
            nominatedBy={nominatedBy?.[info.key]}
            toggleFavorite={toggleFavorite}
            toggleSelected={_toggleSelected}
          />
        )}
      </Table>
    </div>
  );
}

export default React.memo(styled(Targets)`
  text-align: center;

  th.isClickable {
    .ui--Icon {
      margin-left: 0.5rem;
    }
  }

  .ui--Table {
    overflow-x: auto;
  }
`);
