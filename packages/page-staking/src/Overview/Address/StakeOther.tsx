// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Balance } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useMemo } from 'react';
import { AddressMini, Expander } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { BN_ZERO } from '@polkadot/util';

interface Props {
  stakeOther?: BN;
  nominators: [string, Balance][];
}

function extractFunction (all: [string, Balance][]): null | [number, () => React.ReactNode[]] {
  return all.length
    ? [
      all.length,
      () => all.map(([who, bonded]): React.ReactNode =>
        <AddressMini
          bonded={bonded}
          key={who}
          value={who}
          withBonded
        />
      )
    ]
    : null;
}

function extractTotals (maxPaid: BN | undefined, nominators: [string, Balance][], stakeOther?: BN): [null | [number, () => React.ReactNode[]], BN, null | [number, () => React.ReactNode[]], BN] {
  const sorted = nominators.sort((a, b) => b[1].cmp(a[1]));

  if (!maxPaid || maxPaid.gtn(sorted.length)) {
    return [extractFunction(sorted), stakeOther || BN_ZERO, null, BN_ZERO];
  }

  const max = maxPaid.toNumber();
  const rewarded = sorted.slice(0, max);
  const rewardedTotal = rewarded.reduce((total, [, value]) => total.iadd(value), new BN(0));
  const unrewarded = sorted.slice(max);
  const unrewardedTotal = unrewarded.reduce((total, [, value]) => total.iadd(value), new BN(0));

  return [extractFunction(rewarded), rewardedTotal, extractFunction(unrewarded), unrewardedTotal];
}

function StakeOther ({ nominators, stakeOther }: Props): React.ReactElement<Props> {
  const { api } = useApi();

  const [rewarded, rewardedTotal, unrewarded, unrewardedTotal] = useMemo(
    () => extractTotals(api.consts.staking?.maxNominatorRewardedPerValidator, nominators, stakeOther),
    [api, nominators, stakeOther]
  );

  return (
    <td className='expand all'>
      {rewarded && (
        <>
          <Expander
            renderChildren={rewarded[1]}
            summary={
              <FormatBalance
                labelPost={` (${rewarded[0]})`}
                value={rewardedTotal}
              />
            }/>
          {unrewarded && (
            <Expander
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
        </>
      )}
    </td>
  );
}

export default React.memo(StakeOther);
