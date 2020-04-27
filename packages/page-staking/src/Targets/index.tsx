// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { StakerState } from '@polkadot/react-hooks/types';
import { ValidatorInfo } from './types';

import BN from 'bn.js';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Icon, InputBalance, Table, Button } from '@polkadot/react-components';
import { useDebounce } from '@polkadot/react-hooks';

import { useTranslation } from '../translate';
import Nominate from './Nominate';
import Summary from './Summary';
import Validator from './Validator';
import useOwnNominators from './useOwnNominators';
import useSortedTargets from './useSortedTargets';

interface Props {
  className?: string;
  ownStashes?: StakerState[];
}

type SortBy = 'rankOverall' | 'rankBondOwn' | 'rankBondOther' | 'rankBondTotal' | 'rankComm';

const MAX_NOMINATIONS = 16;

function sort (sortBy: SortBy, sortFromMax: boolean, validators: ValidatorInfo[]): number[] {
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

function Targets ({ className, ownStashes }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const ownNominators = useOwnNominators(ownStashes);
  const [_amount, setAmount] = useState<BN | undefined>(new BN(1_000));
  const amount = useDebounce(_amount);
  const { lastReward, nominators, toggleFavorite, totalStaked, validators } = useSortedTargets(amount);
  const [selected, setSelected] = useState<string[]>([]);
  const [sorted, setSorted] = useState<number[] | undefined>();
  const [{ sortBy, sortFromMax }, setSortBy] = useState<{ sortBy: SortBy; sortFromMax: boolean }>({ sortBy: 'rankOverall', sortFromMax: true });

  useEffect((): void => {
    validators && setSorted(
      sort(sortBy, sortFromMax, validators)
    );
  }, [sortBy, sortFromMax, validators]);

  const _sort = useCallback(
    (newSortBy: SortBy) => setSortBy(({ sortBy, sortFromMax }) => ({
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
    [t('validators'), 'start', 3],
    ...['rankComm', 'rankBondTotal', 'rankBondOwn', 'rankBondOther', 'rankOverall'].map((header) => [
      <>{labels[header]}<Icon name={sortBy === header ? (sortFromMax ? 'chevron down' : 'chevron up') : 'minus'} /></>,
      `isClickable ${sortBy === header && 'ui--highlight--border'} number`,
      1,
      (): void => _sort(header as 'rankComm')
    ]),
    []
  ], [_sort, labels, sortBy, sortFromMax, t]);

  const filter = useMemo(() => (
    <InputBalance
      className='balanceInput'
      help={t('The amount that will be used on a per-validator basis to calculate profits for that validator.')}
      isFull
      label={t('amount to use for estimation')}
      onChange={setAmount}
      value={_amount}
    />
  ), [_amount, t]);

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
        <Button.Or />
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
        {validators && sorted?.map((index): React.ReactNode =>
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
