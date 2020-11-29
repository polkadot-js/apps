// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveStakingOverview, DeriveHasIdentity } from '@polkadot/api-derive/types';
import type { StakerState } from '@polkadot/react-hooks/types';
import type { SortedTargets, TargetSortBy, ValidatorInfo } from '../types';

import BN from 'bn.js';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { Button, Icon, Table, Toggle } from '@polkadot/react-components';
import { useApi, useAvailableSlashes, useCall } from '@polkadot/react-hooks';

import ElectionBanner from '../ElectionBanner';
import Filtering from '../Filtering';
import Legend from '../Legend';
import { MAX_NOMINATIONS } from '../constants';
import { useTranslation } from '../translate';
import Nominate from './Nominate';
import Summary from './Summary';
import Validator from './Validator';
import useOwnNominators from './useOwnNominators';

interface Props {
  className?: string;
  isInElection: boolean;
  ownStashes?: StakerState[];
  stakingOverview?: DeriveStakingOverview;
  targets: SortedTargets;
  toggleFavorite: (address: string) => void;
}

interface Flags {
  maxPaid: BN | undefined;
  withElected: boolean;
  withGroup: boolean;
  withIdentity: boolean;
  withoutComm: boolean;
  withoutOver: boolean;
}

interface SortState {
  sortBy: TargetSortBy;
  sortFromMax: boolean;
}

const CLASSES: Record<string, string> = {
  rankBondOther: 'media--1600',
  rankNumNominators: 'media--1200'
};
const MAX_COMM_FILTER = 20;
const SORT_KEYS = ['rankNumNominators', 'rankComm', 'rankBondTotal', 'rankBondOwn', 'rankBondOther', 'rankOverall'];

function filterValidators (validators: ValidatorInfo[], allIdentity: Record<string, DeriveHasIdentity>, { maxPaid, withElected, withGroup, withIdentity, withoutComm, withoutOver }: Flags): ValidatorInfo[] {
  const parentIds: string[] = [];

  return validators.filter(({ accountId, commissionPer, isElected, isFavorite, numNominators }): boolean => {
    if (isFavorite) {
      return true;
    }

    const stashId = accountId.toString();
    const thisIdentity = allIdentity[stashId];

    if (
      (!withIdentity || !!thisIdentity?.hasIdentity) &&
      (!withElected || isElected) &&
      (!withoutComm || (commissionPer < MAX_COMM_FILTER)) &&
      (!withoutOver || !maxPaid || maxPaid.gtn(numNominators))
    ) {
      if (!withGroup || !thisIdentity || !thisIdentity.parentId) {
        if (!parentIds.includes(stashId)) {
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

function transformIdentity ([[validatorIds], hasIdentities]: [[string[]], DeriveHasIdentity[]]): Record<string, DeriveHasIdentity> {
  return validatorIds.reduce((result: Record<string, DeriveHasIdentity>, validatorId, index): Record<string, DeriveHasIdentity> => {
    result[validatorId] = hasIdentities[index];

    return result;
  }, {});
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

function Targets ({ className = '', isInElection, ownStashes, targets: { avgStaked, inflation: { stakedReturn }, lastReward, lowStaked, nominators, totalIssuance, totalStaked, validatorIds = [], validators }, toggleFavorite }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const allSlashes = useAvailableSlashes();
  const ownNominators = useOwnNominators(ownStashes);
  const [selected, setSelected] = useState<string[]>([]);
  const [{ isQueryFiltered, nameFilter }, setNameFilter] = useState({ isQueryFiltered: false, nameFilter: '' });
  const [withElected, setWithElected] = useState(false);
  const [withGroup, setWithGroup] = useState(true);
  const [withIdentity, setWithIdentity] = useState(false);
  const [withoutComm, setWithoutComm] = useState(true);
  const [withoutOver, setWithoutOver] = useState(true);
  const [{ sortBy, sortFromMax }, setSortBy] = useState<SortState>({ sortBy: 'rankOverall', sortFromMax: true });
  const [sorted, setSorted] = useState<ValidatorInfo[] | undefined>();
  const allIdentity = useCall<Record<string, DeriveHasIdentity>>(api.derive.accounts.hasIdentityMulti, [validatorIds], { transform: transformIdentity, withParamsTransform: true });

  const labelsRef = useRef({
    rankBondOther: t<string>('other stake'),
    rankBondOwn: t<string>('own stake'),
    rankBondTotal: t<string>('total stake'),
    rankComm: t<string>('comm.'),
    rankNumNominators: t<string>('nominators'),
    rankOverall: t<string>('return')
  });

  const flags = useMemo(
    () => ({
      isQueryFiltered,
      maxPaid: api.consts.staking?.maxNominatorRewardedPerValidator,
      withElected,
      withGroup,
      withIdentity,
      withoutComm,
      withoutOver
    }),
    [api, isQueryFiltered, withElected, withGroup, withIdentity, withoutComm, withoutOver]
  );

  const filtered = useMemo(
    () => allIdentity && validators && filterValidators(validators, allIdentity, flags),
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
    ...(SORT_KEYS as (keyof typeof labelsRef.current)[]).map((header) => [
      <>{labelsRef.current[header]}<Icon icon={sortBy === header ? (sortFromMax ? 'chevron-down' : 'chevron-up') : 'minus'} /></>,
      `${sorted ? `isClickable ${sortBy === header ? 'highlight--border' : ''} number` : 'number'} ${CLASSES[header] || ''}`,
      1,
      () => _sort(header as 'rankComm')
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
          label={t<string>('limit single operator exposure')}
          onChange={setWithGroup}
          value={withGroup}
        />
        <Toggle
          className='staking--buttonToggle'
          label={t<string>('no {{maxComm}}%+ comm', { replace: { maxComm: MAX_COMM_FILTER } })}
          onChange={setWithoutComm}
          value={withoutComm}
        />
        <Toggle
          className='staking--buttonToggle'
          label={t<string>('no oversubscribed')}
          onChange={setWithoutOver}
          value={withoutOver}
        />
        <Toggle
          className='staking--buttonToggle'
          label={t<string>('only elected')}
          onChange={setWithElected}
          value={withElected}
        />
      </Filtering>
    </div>
  ), [nameFilter, _setNameFilter, t, withElected, withGroup, withIdentity, withoutComm, withoutOver]);

  const displayList = isQueryFiltered
    ? validators
    : sorted;

  return (
    <div className={className}>
      <Summary
        avgStaked={avgStaked}
        lastReward={lastReward}
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
