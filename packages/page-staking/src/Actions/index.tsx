// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { StakerState } from '@polkadot/react-hooks/types';
import type { SortedTargets } from '../types';

import BN from 'bn.js';
import React, { useMemo, useRef, useState } from 'react';

import { Button, Table, ToggleGroup } from '@polkadot/react-components';
import { useAvailableSlashes } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { BN_ZERO } from '@polkadot/util';

import ElectionBanner from '../ElectionBanner';
import { useTranslation } from '../translate';
import Account from './Account';
import NewNominator from './NewNominator';
import NewStash from './NewStash';
import NewValidator from './NewValidator';

interface Props {
  className?: string;
  isInElection?: boolean;
  ownStashes?: StakerState[];
  next?: string[];
  validators?: string[];
  targets: SortedTargets;
}

interface State {
  bondedNoms?: BN;
  bondedNone?: BN;
  bondedTotal?: BN;
  bondedVals?: BN;
  foundStashes?: StakerState[];
}

function assignValue ({ isStashNominating, isStashValidating }: StakerState): number {
  return isStashValidating
    ? 1
    : isStashNominating
      ? 5
      : 99;
}

function sortStashes (a: StakerState, b: StakerState): number {
  return assignValue(a) - assignValue(b);
}

function extractState (ownStashes?: StakerState[]): State {
  if (!ownStashes) {
    return {};
  }

  const bondedNoms = new BN(0);
  const bondedNone = new BN(0);
  const bondedVals = new BN(0);
  const bondedTotal = new BN(0);

  ownStashes.forEach(({ isStashNominating, isStashValidating, stakingLedger }): void => {
    const value = stakingLedger && stakingLedger.total
      ? stakingLedger.total.unwrap()
      : BN_ZERO;

    bondedTotal.iadd(value);

    if (isStashNominating) {
      bondedNoms.iadd(value);
    } else if (isStashValidating) {
      bondedVals.iadd(value);
    } else {
      bondedNone.iadd(value);
    }
  });

  return {
    bondedNoms,
    bondedNone,
    bondedTotal,
    bondedVals,
    foundStashes: ownStashes.sort(sortStashes)
  };
}

function filterStashes (typeIndex: number, stashes: StakerState[]): StakerState[] {
  return stashes.filter(({ isStashNominating, isStashValidating }) => {
    switch (typeIndex) {
      case 1: return isStashNominating;
      case 2: return isStashValidating;
      case 3: return !isStashNominating && !isStashValidating;
      default: return true;
    }
  });
}

function getValue (typeIndex: number, { bondedNoms, bondedNone, bondedTotal, bondedVals }: State): BN | undefined {
  switch (typeIndex) {
    case 0: return bondedTotal;
    case 1: return bondedNoms;
    case 2: return bondedVals;
    case 3: return bondedNone;
    default: return bondedTotal;
  }
}

function formatTotal (typeIndex: number, state: State): React.ReactNode {
  const value = getValue(typeIndex, state);

  return value && <FormatBalance value={value} />;
}

function Actions ({ className = '', isInElection, ownStashes, targets }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const allSlashes = useAvailableSlashes();
  const [typeIndex, setTypeIndex] = useState(0);

  const headerRef = useRef([
    [t('stashes'), 'start', 2],
    [t('controller'), 'address'],
    [t('rewards'), 'start media--1200'],
    [t('bonded'), 'number'],
    [undefined, undefined, 2]
  ]);

  const typeRef = useRef([
    { text: t('All stashes'), value: 'all' },
    { text: t('Nominators'), value: 'noms' },
    { text: t('Validators'), value: 'vals' },
    { text: t('Inactive'), value: 'chill' }
  ]);

  const state = useMemo(
    () => extractState(ownStashes),
    [ownStashes]
  );

  const footer = useMemo(() => (
    <tr>
      <td colSpan={4} />
      <td className='number'>{formatTotal(typeIndex, state)}</td>
      <td colSpan={2} />
    </tr>
  ), [state, typeIndex]);

  const filtered = useMemo(
    () => state.foundStashes && filterStashes(typeIndex, state.foundStashes),
    [state, typeIndex]
  );

  return (
    <div className={className}>
      <Button.Group>
        <ToggleGroup
          onChange={setTypeIndex}
          options={typeRef.current}
          value={typeIndex}
        />
        <NewNominator
          isInElection={isInElection}
          targets={targets}
        />
        <NewValidator isInElection={isInElection} />
        <NewStash />
      </Button.Group>
      <ElectionBanner isInElection={isInElection} />
      <Table
        empty={filtered && t<string>('No funds staked yet. Bond funds to validate or nominate a validator')}
        footer={footer}
        header={headerRef.current}
      >
        {filtered?.map((info): React.ReactNode => (
          <Account
            allSlashes={allSlashes}
            info={info}
            isDisabled={isInElection}
            key={info.stashId}
            targets={targets}
          />
        ))}
      </Table>
    </div>
  );
}

export default React.memo(Actions);
