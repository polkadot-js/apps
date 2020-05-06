// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StakerState } from '@polkadot/react-hooks/types';
import { SortedTargets, TargetSortBy, ValidatorInfo } from '../types';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Icon, InputBalance, Table, Button } from '@polkadot/react-components';

import { MAX_NOMINATIONS } from '../constants';
import { useTranslation } from '../translate';
import Nominate from './Nominate';
import Summary from './Summary';
import Validator from './Validator';
import useOwnNominators from './useOwnNominators';

interface Props {
  className?: string;
  ownStashes?: StakerState[];
  targets: SortedTargets;
}

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

function Targets ({ className, ownStashes, targets: { calcWith, lastReward, nominators, setCalcWith, toggleFavorite, totalStaked, validators } }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const ownNominators = useOwnNominators(ownStashes);
  const [selected, setSelected] = useState<string[]>([]);
  const [sorted, setSorted] = useState<number[] | undefined>();
  const [{ sortBy, sortFromMax }, setSortBy] = useState<{ sortBy: TargetSortBy; sortFromMax: boolean }>({ sortBy: 'rankOverall', sortFromMax: true });

  useEffect((): void => {
    validators && setSorted(
      sort(sortBy, sortFromMax, validators)
    );
  }, [sortBy, sortFromMax, validators]);

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
      (validators || [])
        .filter((_, index) => index < MAX_NOMINATIONS)
        .map(({ key }) => key)
    ),
    [validators]
  );

  const labels = useMemo(
    (): Record<string, string> => ({
      rankBondOther: t('other stake'),
      rankBondOwn: t('own stake'),
      rankBondTotal: t('total stake'),
      rankComm: t('commission'),
      rankOverall: t('profit/era est')
    }),
    [t]
  );

  const header = useMemo(() => [
    [t('validators'), 'start', 4],
    ...['rankComm', 'rankBondTotal', 'rankBondOwn', 'rankBondOther', 'rankOverall'].map((header) => [
      <>{labels[header]}<Icon name={sortBy === header ? (sortFromMax ? 'chevron down' : 'chevron up') : 'minus'} /></>,
      sorted ? `isClickable ${sortBy === header && 'ui--highlight--border'} number` : 'number',
      1,
      (): void => _sort(header as 'rankComm')
    ]),
    []
  ], [_sort, labels, sortBy, sorted, sortFromMax, t]);

  const filter = useMemo(() => (
    sorted && (
      <InputBalance
        className='balanceInput'
        help={t('The amount that will be used on a per-validator basis to calculate profits for that validator.')}
        isFull
        label={t('amount to use for estimation')}
        onChange={setCalcWith}
        value={calcWith}
      />
    )
  ), [calcWith, setCalcWith, sorted, t]);

  return (
    <div className={className}>
      <Summary
        lastReward={lastReward}
        numNominators={nominators?.length}
        numValidators={validators?.length}
        totalStaked={totalStaked}
      />
      <Button.Group>
        <Button
          icon='check'
          isDisabled={!validators?.length || !ownNominators?.length}
          label={t('Select best')}
          onClick={_selectProfitable}
        />
        <Nominate
          ownNominators={ownNominators}
          targets={selected}
        />
      </Button.Group>
      <Table
        empty={sorted && t('No active validators to check')}
        filter={filter}
        header={header}
      >
        {validators && sorted && (validators.length === sorted.length) && sorted.map((index): React.ReactNode =>
          <Validator
            canSelect={selected.length < MAX_NOMINATIONS}
            info={validators[index]}
            isSelected={selected.includes(validators[index].key)}
            key={validators[index].key}
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

  th {
    i.icon {
      margin-left: 0.5rem;
    }
  }
  .ui--Table {
    overflow-x: auto;
  }
`);
