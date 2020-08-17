// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveStakingOverview } from '@polkadot/api-derive/types';
import { StakerState } from '@polkadot/react-hooks/types';
import { SortedTargets, TargetSortBy, ValidatorInfo } from '../types';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Button, Icon, InputBalance, Table, Toggle } from '@polkadot/react-components';
import { useAvailableSlashes } from '@polkadot/react-hooks';

import ElectionBanner from '../ElectionBanner';
import Filtering from '../Filtering';
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

interface SortState {
  sortBy: TargetSortBy;
  sortFromMax: boolean;
}

const CLASSES: Record<string, string> = {
  rankBondOther: 'ui--media-1600',
  rankNumNominators: 'ui--media-1200'
};

function sort (sortBy: TargetSortBy, sortFromMax: boolean, validators: ValidatorInfo[]): number[] {
  return [...Array(validators.length).keys()]
    .sort((a, b) =>
      sortFromMax
        ? validators[a][sortBy] - validators[b][sortBy]
        : validators[b][sortBy] - validators[a][sortBy]
    )
    .sort((a, b) =>
      validators[a].isFavorite === validators[b].isFavorite
        ? 0
        : (validators[a].isFavorite ? -1 : 1)
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

function Targets ({ className = '', isInElection, ownStashes, targets: { avgStaked, calcWith, lastReward, lowStaked, nominators, setCalcWith, totalStaked, validators }, toggleFavorite }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const allSlashes = useAvailableSlashes();
  const ownNominators = useOwnNominators(ownStashes);
  const [selected, setSelected] = useState<string[]>([]);
  const [nameFilter, setNameFilter] = useState<string>('');
  const [withElected, setWithElected] = useState(false);
  const [withIdentity, setWithIdentity] = useState(false);
  const [{ sortBy, sortFromMax }, setSortBy] = useState<SortState>({ sortBy: 'rankOverall', sortFromMax: true });
  const [sorted, setSorted] = useState<number[] | undefined>();

  // We are using an effect here to get this async. Sorting will have a double-render, however it allows
  // the page to immediately display (with loading), whereas useMemo would have a laggy interface
  // (the same applies for changing the sort order, state here is more effective)
  useEffect((): void => {
    validators && setSorted(sort(sortBy, sortFromMax, validators));
  }, [sortBy, sortFromMax, validators]);

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
        ? selected.filter((accountId): boolean => address !== accountId)
        : [...selected, address]
    ),
    [selected]
  );

  const _selectProfitable = useCallback(
    () => setSelected(
      (validators || []).reduce((result: string[], { hasIdentity, isElected, isFavorite, key, rewardPayout }): string[] => {
        if ((result.length < MAX_NOMINATIONS) && (hasIdentity || !withIdentity) && (isElected || isFavorite) && !rewardPayout.isZero()) {
          result.push(key);
        }

        return result;
      }, [])
    ),
    [validators, withIdentity]
  );

  const labels = useMemo(
    (): Record<string, string> => ({
      rankBondOther: t<string>('other stake'),
      rankBondOwn: t<string>('own stake'),
      rankBondTotal: t<string>('total stake'),
      rankComm: t<string>('comm.'),
      rankNumNominators: t<string>('nominators'),
      rankOverall: t<string>('profit/era')
    }),
    [t]
  );

  const header = useMemo(() => [
    [t('validators'), 'start', 3],
    ...['rankNumNominators', 'rankComm', 'rankBondTotal', 'rankBondOwn', 'rankBondOther', 'rankOverall'].map((header) => [
      <>{labels[header]}<Icon icon={sortBy === header ? (sortFromMax ? 'chevron-down' : 'chevron-up') : 'minus'} /></>,
      `${sorted ? `isClickable ${sortBy === header ? 'ui--highlight--border' : ''} number` : 'number'} ${CLASSES[header] || ''}`,
      1,
      (): void => _sort(header as 'rankComm')
    ]),
    []
  ], [_sort, labels, sortBy, sorted, sortFromMax, t]);

  const filter = useMemo(() => (
    sorted && (
      <div>
        <InputBalance
          className='balanceInput'
          help={t<string>('The amount that will be used on a per-validator basis to calculate profits for that validator.')}
          isFull
          isZeroable={false}
          label={t<string>('amount to use for estimation')}
          onChange={setCalcWith}
          value={calcWith}
        />
        <Filtering
          nameFilter={nameFilter}
          setNameFilter={setNameFilter}
          setWithIdentity={setWithIdentity}
          withIdentity={withIdentity}
        >
          <Toggle
            className='staking--buttonToggle'
            label={t<string>('limit to elected')}
            onChange={setWithElected}
            value={withElected}
          />
        </Filtering>
      </div>
    )
  ), [calcWith, setCalcWith, nameFilter, sorted, t, withElected, withIdentity]);

  return (
    <div className={className}>
      <Summary
        avgStaked={avgStaked}
        lastReward={lastReward}
        lowStaked={lowStaked}
        numNominators={nominators?.length}
        numValidators={validators?.length}
        totalStaked={totalStaked}
      />
      <ElectionBanner isInElection={isInElection} />
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
      <Table
        empty={sorted && t<string>('No active validators to check')}
        filter={filter}
        header={header}
      >
        {validators && sorted && (validators.length === sorted.length) && sorted.map((index): React.ReactNode =>
          <Validator
            allSlashes={allSlashes}
            canSelect={selected.length < MAX_NOMINATIONS}
            filterName={nameFilter}
            info={validators[index]}
            isNominated={myNominees.includes(validators[index].key)}
            isSelected={selected.includes(validators[index].key)}
            key={validators[index].key}
            toggleFavorite={toggleFavorite}
            toggleSelected={_toggleSelected}
            withElected={withElected}
            withIdentity={withIdentity}
          />
        )}
      </Table>
    </div>
  );
}

export default React.memo(styled(Targets)`
  text-align: center;

  th {
    .ui--Icon {
      margin-left: 0.5rem;
    }
  }

  .ui--Table {
    overflow-x: auto;
  }
`);
