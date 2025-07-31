// Copyright 2017-2025 @polkadot/app-staking-async authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { u32 } from '@polkadot/types';
import type { NominatorValue } from './types.js';

import React, { useMemo } from 'react';

import { AddressMini, ExpanderScroll } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { BN, BN_ZERO } from '@polkadot/util';

interface Props {
  stakeOther?: BN;
  nominators?: NominatorValue[];
}

function extractFunction (all: NominatorValue[]): null | [number, () => React.ReactNode[]] {
  return [
    all.length,
    () => all.map(({ nominatorId, value }): React.ReactNode =>
      <AddressMini
        bonded={value}
        key={nominatorId}
        value={nominatorId}
        withBonded
      />
    )
  ];
}

function sumValue (all: { value: BN }[]): BN {
  const total = new BN(0);

  for (let i = 0, count = all.length; i < count; i++) {
    total.iadd(all[i].value);
  }

  return total;
}

function extractTotals (maxPaid: BN | undefined, nominators?: NominatorValue[], stakeOther?: BN): [null | [number, () => React.ReactNode[]], BN, null | [number, () => React.ReactNode[]], BN] {
  if (!nominators) {
    return [null, BN_ZERO, null, BN_ZERO];
  }

  const sorted = nominators.sort((a, b) => b.value.cmp(a.value));

  if (!maxPaid || maxPaid.gtn(sorted.length)) {
    return [extractFunction(sorted), stakeOther || BN_ZERO, null, BN_ZERO];
  }

  const max = maxPaid.toNumber();
  const rewarded = sorted.slice(0, max);
  const rewardedTotal = sumValue(rewarded);
  const unrewarded = sorted.slice(max);
  const unrewardedTotal = sumValue(unrewarded);

  return [extractFunction(rewarded), rewardedTotal, extractFunction(unrewarded), unrewardedTotal];
}

function StakeOther ({ nominators, stakeOther }: Props): React.ReactElement<Props> {
  const { api } = useApi();

  const [rewarded, rewardedTotal, unrewarded, unrewardedTotal] = useMemo(
    () => extractTotals(api.consts.staking?.maxNominatorRewardedPerValidator as u32, nominators, stakeOther),
    [api, nominators, stakeOther]
  );

  return (
    <td className='expand all'>
      {(!rewarded || rewarded[0] !== 0) && (
        <ExpanderScroll
          className={rewarded ? '' : '--tmp'}
          renderChildren={rewarded?.[1]}
          summary={
            <FormatBalance
              labelPost={` (${rewarded ? rewarded[0] : '0'})`}
              value={rewardedTotal}
            />
          }
        />
      )}
      {unrewarded && (
        <ExpanderScroll
          className='stakeOver'
          renderChildren={unrewarded[1]}
          summary={
            <FormatBalance
              labelPost={` (${unrewarded[0]})`}
              value={unrewardedTotal}
            />
          }
        />
      )}
    </td>
  );
}

export default React.memo(StakeOther);
