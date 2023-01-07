// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { NominatorValue } from './types';

import React, { useMemo } from 'react';

import { AddressMini, ExpanderScroll } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { BN, BN_ZERO } from '@polkadot/util';

import { useTranslation } from '../../translate';

interface Props {
  className?: string;
  stakeOther?: BN;
  nominators: NominatorValue[];
}

function extractFunction (all: NominatorValue[]): null | [number, () => React.ReactNode[]] {
  return all.length
    ? [
      all.length,
      () => all.map(({ nominatorId, value }): React.ReactNode =>
        <AddressMini
          bonded={value}
          key={nominatorId}
          value={nominatorId}
          withBonded
        />
      )
    ]
    : null;
}

function sumValue (all: { value: BN }[]): BN {
  const total = new BN(0);

  for (let i = 0; i < all.length; i++) {
    total.iadd(all[i].value);
  }

  return total;
}

function extractTotals (maxPaid: BN | undefined, nominators: NominatorValue[], stakeOther?: BN): [null | [number, () => React.ReactNode[]], BN, null | [number, () => React.ReactNode[]], BN] {
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

function StakeOther ({ className, nominators, stakeOther }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();

  const [rewarded, rewardedTotal, unrewarded, unrewardedTotal] = useMemo(
    () => extractTotals(api.consts.staking?.maxNominatorRewardedPerValidator, nominators, stakeOther),
    [api, nominators, stakeOther]
  );

  return (
    <>
      {rewarded && (
        <tr className={className}>
          <td />
          <td className='number top all'>
            <h5>{t<string>('other stake ({{count}})', { replace: { count: rewarded[0] } })}</h5>
          </td>
          <td className='number top'>
            <ExpanderScroll
              renderChildren={rewarded[1]}
              summary={
                <FormatBalance value={rewardedTotal} />
              }
            />
          </td>
          <td />
        </tr>
      )}
      {unrewarded && (
        <tr className={className}>
          <td />
          <td className='number top all'>
            <h5>{t<string>('inactive stake ({{count}})', { replace: { count: unrewarded[0] } })}</h5>
          </td>
          <td className='number top'>
            <ExpanderScroll
              renderChildren={unrewarded[1]}
              summary={
                <FormatBalance value={unrewardedTotal} />
              }
            />
          </td>
          <td />
        </tr>
      )}
    </>
  );
}

export default React.memo(StakeOther);
