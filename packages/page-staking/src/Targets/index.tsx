// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveHasIdentity, DeriveStakingOverview } from '@polkadot/api-derive/types';
import type { StakerState } from '@polkadot/react-hooks/types';
import type { NominatedBy, SortedTargets, TargetSortBy, ValidatorInfo } from '../types';

import BN from 'bn.js';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';

import { Button, Icon, Table, Toggle } from '@polkadot/react-components';
import { useApi, useAvailableSlashes, useBlocksPerDays } from '@polkadot/react-hooks';

import { MAX_NOMINATIONS } from '../constants';
import ElectionBanner from '../ElectionBanner';
import Filtering from '../Filtering';
import Legend from '../Legend';
import { useTranslation } from '../translate';
import useIdentities from '../useIdentities';
import useNominations from '../useNominations';
import Nominate from './Nominate';
import Summary from './Summary';
import useOwnNominators from './useOwnNominators';
import Validator from './Validator';

interface Props {
  className?: string;
  isInElection: boolean;
  ownStashes?: StakerState[];
  stakingOverview?: DeriveStakingOverview;
  targets: SortedTargets;
  toggleFavorite: (address: string) => void;
}

interface Flags {
  daysPayout: BN;
  isBabe: boolean;
  maxPaid: BN | undefined;
  withElected: boolean;
  withGroup: boolean;
  withIdentity: boolean;
  withPayout: boolean;
  withoutComm: boolean;
  withoutOver: boolean;
}

interface SortState {
  sortBy: TargetSortBy;
  sortFromMax: boolean;
}

const CLASSES: Record<string, string> = {
  rankBondOther: 'media--1600',
  rankBondOwn: 'media--900'
};
const MAX_CAP_PERCENT = 100; // 75 if only using numNominators
const MAX_COMM_PERCENT = 20; // -1 for median
const MAX_DAYS = 7;
const SORT_KEYS = ['rankBondTotal', 'rankBondOwn', 'rankBondOther', 'rankOverall'];

function overlapsDisplay (displays: (string[])[], test: string[]): boolean {
  return displays.some((d) =>
    d.length === test.length
      ? d.length === 1
        ? d[0] === test[0]
        : d.reduce((c, p, i) => c + (p === test[i] ? 1 : 0), 0) >= (test.length - 1)
      : false
  );
}

function applyFilter (validators: ValidatorInfo[], medianComm: number, allIdentity: Record<string, DeriveHasIdentity>, { daysPayout, isBabe, maxPaid, withElected, withGroup, withIdentity, withPayout, withoutComm, withoutOver }: Flags, nominatedBy?: Record<string, NominatedBy[]>): ValidatorInfo[] {
  const displays: (string[])[] = [];
  const parentIds: string[] = [];

  return validators.filter(({ accountId, commissionPer, isElected, isFavorite, lastPayout, numNominators }): boolean => {
    if (isFavorite) {
      return true;
    }

    const stashId = accountId.toString();
    const thisIdentity = allIdentity[stashId];
    const nomCount = nominatedBy?.[stashId]?.length || numNominators || 0;

    if (
      (!withElected || isElected) &&
      (!withIdentity || !!thisIdentity?.hasIdentity) &&
      (!withPayout || !isBabe || (!!lastPayout && daysPayout.gte(lastPayout))) &&
      (!withoutComm || (
        MAX_COMM_PERCENT > 0
          ? (commissionPer < MAX_COMM_PERCENT)
          : (!medianComm || (commissionPer <= medianComm)))
      ) &&
      (!withoutOver || !maxPaid || maxPaid.muln(MAX_CAP_PERCENT).divn(100).gten(nomCount))
    ) {
      if (!withGroup) {
        return true;
      } else if (!thisIdentity || !thisIdentity.hasIdentity) {
        parentIds.push(stashId);

        return true;
      } else if (!thisIdentity.parentId) {
        if (!parentIds.includes(stashId)) {
          if (thisIdentity.display) {
            const sanitized = thisIdentity.display
              .replace(/[^\x20-\x7E]/g, '')
              .replace(/-/g, ' ')
              .replace(/_/g, ' ')
              .split(' ')
              .map((p) => p.trim())
              .filter((v) => !!v);

            if (overlapsDisplay(displays, sanitized)) {
              return false;
            }

            displays.push(sanitized);
          }

          parentIds.push(stashId);

          return true;
        }
      } else if (!parentIds.includes(thisIdentity.parentId)) {
        parentIds.push(thisIdentity.parentId);

        return true;
      }
    }

    return false;
  });
}

function sort (sortBy: TargetSortBy, sortFromMax: boolean, validators: ValidatorInfo[]): ValidatorInfo[] {
  return validators
    .sort((a, b) => sortFromMax
      ? a[sortBy] - b[sortBy]
      : b[sortBy] - a[sortBy]
    )
    .sort((a, b) => a.isFavorite === b.isFavorite
      ? 0
      : (a.isFavorite ? -1 : 1)
    );
}

function extractNominees (ownNominators: StakerState[] = []): string[] {
  const myNominees: string[] = [];

  ownNominators.forEach(({ nominating = [] }: StakerState): void => {
    nominating.forEach((nominee: string): void => {
      !myNominees.includes(nominee) && myNominees.push(nominee);
    });
  });

  return myNominees;
}

function selectProfitable (list: ValidatorInfo[]): string[] {
  const result: string[] = [];

  for (let i = 0; i < list.length && result.length < MAX_NOMINATIONS; i++) {
    const { isFavorite, key, stakedReturnCmp } = list[i];

    if (isFavorite || (stakedReturnCmp > 0)) {
      result.push(key);
    }
  }

  return result;
}

function Targets ({ className = '', isInElection, ownStashes, targets: { avgStaked, inflation: { stakedReturn }, lowStaked, medianComm, nominators, totalIssuance, totalStaked, validatorIds, validators }, toggleFavorite }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const allSlashes = useAvailableSlashes();
  const daysPayout = useBlocksPerDays(MAX_DAYS);
  const ownNominators = useOwnNominators(ownStashes);
  const nominatedBy = useNominations(true);
  const allIdentity = useIdentities(validatorIds);
  const [selected, setSelected] = useState<string[]>([]);
  const [{ isQueryFiltered, nameFilter }, setNameFilter] = useState({ isQueryFiltered: false, nameFilter: '' });
  const [withElected, setWithElected] = useState(false);
  const [withGroup, setWithGroup] = useState(true);
  const [withIdentity, setWithIdentity] = useState(false);
  const [withPayout, setWithPayout] = useState(false);
  const [withoutComm, setWithoutComm] = useState(true);
  const [withoutOver, setWithoutOver] = useState(true);
  const [{ sortBy, sortFromMax }, setSortBy] = useState<SortState>({ sortBy: 'rankOverall', sortFromMax: true });
  const [sorted, setSorted] = useState<ValidatorInfo[] | undefined>();

  const labelsRef = useRef({
    rankBondOther: t<string>('other stake'),
    rankBondOwn: t<string>('own stake'),
    rankBondTotal: t<string>('total stake'),
    rankOverall: t<string>('return')
  });

  const flags = useMemo(
    () => ({
      daysPayout,
      isBabe: !!api.consts.babe,
      isQueryFiltered,
      maxPaid: api.consts.staking?.maxNominatorRewardedPerValidator,
      withElected,
      withGroup,
      withIdentity,
      withPayout,
      withoutComm,
      withoutOver
    }),
    [api, daysPayout, isQueryFiltered, withElected, withGroup, withIdentity, withPayout, withoutComm, withoutOver]
  );

  const filtered = useMemo(
    () => allIdentity && validators && nominatedBy && applyFilter(validators, medianComm, allIdentity, flags, nominatedBy),
    [allIdentity, flags, medianComm, nominatedBy, validators]
  );

  // We are using an effect here to get this async. Sorting will have a double-render, however it allows
  // the page to immediately display (with loading), whereas useMemo would have a laggy interface
  // (the same applies for changing the sort order, state here is more effective)
  useEffect((): void => {
    filtered && setSorted(
      sort(sortBy, sortFromMax, filtered)
    );
  }, [filtered, sortBy, sortFromMax]);

  const myNominees = useMemo(
    () => extractNominees(ownNominators),
    [ownNominators]
  );

  const _sort = useCallback(
    (newSortBy: TargetSortBy) => setSortBy(({ sortBy, sortFromMax }) => ({
      sortBy: newSortBy,
      sortFromMax: newSortBy === sortBy
        ? !sortFromMax
        : true
    })),
    []
  );

  const _toggleSelected = useCallback(
    (address: string) => setSelected(
      selected.includes(address)
        ? selected.filter((accountId) => address !== accountId)
        : [...selected, address]
    ),
    [selected]
  );

  const _selectProfitable = useCallback(
    () => filtered && setSelected(
      selectProfitable(filtered)
    ),
    [filtered]
  );

  const _setNameFilter = useCallback(
    (nameFilter: string, isQueryFiltered: boolean) => setNameFilter({ isQueryFiltered, nameFilter }),
    []
  );

  const header = useMemo(() => [
    [t('validators'), 'start', 3],
    [t('payout'), 'media--1500'],
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
        setWithIdentity={setWithIdentity}
        withIdentity={withIdentity}
      >
        <Toggle
          className='staking--buttonToggle'
          label={t<string>('single from operator')}
          onChange={setWithGroup}
          value={withGroup}
        />
        <Toggle
          className='staking--buttonToggle'
          label={
            MAX_COMM_PERCENT > 0
              ? t<string>('no {{maxComm}}%+ comm', { replace: { maxComm: MAX_COMM_PERCENT } })
              : t<string>('no median+ comm')
          }
          onChange={setWithoutComm}
          value={withoutComm}
        />
        <Toggle
          className='staking--buttonToggle'
          label={
            MAX_CAP_PERCENT < 100
              ? t<string>('no {{maxCap}}%+ capacity', { replace: { maxCap: MAX_CAP_PERCENT } })
              : t<string>('no at capacity')
          }
          onChange={setWithoutOver}
          value={withoutOver}
        />
        {api.consts.babe && (
          // FIXME have some sane era defaults for Aura
          <Toggle
            className='staking--buttonToggle'
            label={t<string>('recent payouts')}
            onChange={setWithPayout}
            value={withPayout}
          />
        )}
        <Toggle
          className='staking--buttonToggle'
          label={t<string>('only elected')}
          onChange={setWithElected}
          value={withElected}
        />
      </Filtering>
    </div>
  ), [api, nameFilter, _setNameFilter, t, withElected, withGroup, withIdentity, withPayout, withoutComm, withoutOver]);

  const displayList = isQueryFiltered
    ? validators
    : sorted;

  return (
    <div className={className}>
      <Summary
        avgStaked={avgStaked}
        lowStaked={lowStaked}
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
          </>
        }
        filter={filter}
        header={header}
        legend={<Legend />}
      >
        {displayList?.map((info): React.ReactNode =>
          <Validator
            allSlashes={allSlashes}
            canSelect={selected.length < MAX_NOMINATIONS}
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
