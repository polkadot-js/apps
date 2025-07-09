// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import '@polkadot/api-augment';

import type { OwnPool } from '@polkadot/app-staking2/Pools/types';
import type { StakerState } from '@polkadot/react-hooks/types';
import type { SortedTargets } from '../types.js';

import React, { useMemo, useRef, useState } from 'react';

import { Button, ToggleGroup } from '@polkadot/react-components';
import { useApi, useAvailableSlashes } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { BN, BN_ZERO } from '@polkadot/util';

import ElectionBanner from '../ElectionBanner.js';
import { useTranslation } from '../translate.js';
import Accounts from './Accounts.js';
import NewNominator from './NewNominator.js';
import NewStash from './NewStash.js';
import NewValidator from './NewValidator.js';
import Pools from './Pools.js';

interface Props {
  className?: string;
  isInElection?: boolean;
  minCommission?: BN;
  ownPools?: OwnPool[];
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
    const value = stakingLedger?.total
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

function filterStashes (stashTypeIndex: number, stashes: StakerState[]): StakerState[] {
  return stashes.filter(({ isStashNominating, isStashValidating }) => {
    switch (stashTypeIndex) {
      case 1: return isStashNominating;
      case 2: return isStashValidating;
      case 3: return !isStashNominating && !isStashValidating;
      default: return true;
    }
  });
}

function getValue (stashTypeIndex: number, { bondedNoms, bondedNone, bondedTotal, bondedVals }: State): BN | undefined {
  switch (stashTypeIndex) {
    case 0: return bondedTotal;
    case 1: return bondedNoms;
    case 2: return bondedVals;
    case 3: return bondedNone;
    default: return bondedTotal;
  }
}

function formatTotal (stashTypeIndex: number, state: State): React.ReactNode {
  const value = getValue(stashTypeIndex, state);

  return value && <FormatBalance value={value} />;
}

function Actions ({ className = '', isInElection, minCommission, ownPools, ownStashes, targets }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const allSlashes = useAvailableSlashes();
  const [accTypeIndex, setAccTypeIndex] = useState(0);
  const [stashTypeIndex, setStashTypeIndex] = useState(0);

  const accTypes = useRef([
    { text: t('Stashed'), value: 'stash' },
    { text: t('Pooled'), value: 'pool' }
  ]);

  const stashTypes = useRef([
    { text: t('All stashes'), value: 'all' },
    { text: t('Nominators'), value: 'noms' },
    { text: t('Validators'), value: 'vals' },
    { text: t('Inactive'), value: 'chill' }
  ]);

  const state = useMemo(
    () => extractState(ownStashes),
    [ownStashes]
  );

  const [filtered, footer] = useMemo(
    () => [
      state.foundStashes && filterStashes(stashTypeIndex, state.foundStashes),
      (
        <tr key='footer'>
          <td colSpan={4} />
          <td className='number'>{formatTotal(stashTypeIndex, state)}</td>
          <td colSpan={2} />
        </tr>
      )
    ],
    [state, stashTypeIndex]
  );

  return (
    <div className={className}>
      <Button.Group>
        {api.consts.nominationPools && (
          <ToggleGroup
            onChange={setAccTypeIndex}
            options={accTypes.current}
            value={accTypeIndex}
          />
        )}
        {accTypeIndex === 0 && (
          <>
            <ToggleGroup
              onChange={setStashTypeIndex}
              options={stashTypes.current}
              value={stashTypeIndex}
            />
            <NewNominator
              isInElection={isInElection}
              targets={targets}
            />
            <NewValidator
              isInElection={isInElection}
              minCommission={minCommission}
              targets={targets}
            />
            <NewStash />
          </>
        )}
      </Button.Group>
      <ElectionBanner isInElection={isInElection} />
      {accTypeIndex === 0
        ? (
          <Accounts
            allSlashes={allSlashes}
            footer={footer}
            isInElection={isInElection}
            list={filtered}
            minCommission={minCommission}
            targets={targets}
          />
        )
        : (
          <Pools
            allSlashes={allSlashes}
            list={ownPools}
            targets={targets}
          />
        )
      }
    </div>
  );
}

export default React.memo(Actions);
