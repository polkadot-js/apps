// Copyright 2017-2022 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { NominatorValue } from './types';

import React, { useMemo } from 'react';

import { formatDarwiniaPower } from '@polkadot/app-staking/Query/util';
import { useTranslation } from '@polkadot/app-staking/translate';
import { AddressMini, ExpanderScroll } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { BN, BN_ZERO } from '@polkadot/util';

interface Props {
  stakeOther?: BN;
  nominators: NominatorValue[];
  isDarwiniaPower?: boolean;
}

function extractFunction (all: NominatorValue[], isDarwiniaPower: boolean | undefined): null | [number, () => React.ReactNode[]] {
  return all.length
    ? [
      all.length,
      () => all.map(({ nominatorId, value }): React.ReactNode =>
        <AddressMini
          bonded={value}
          isDarwiniaPower={isDarwiniaPower}
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

function extractTotals (maxPaid: BN | undefined, nominators: NominatorValue[], isDarwiniaPower: boolean | undefined, stakeOther?: BN): [null | [number, () => React.ReactNode[]], BN, null | [number, () => React.ReactNode[]], BN] {
  const sorted = nominators.sort((a, b) => b.value.cmp(a.value));

  if (!maxPaid || maxPaid.gtn(sorted.length)) {
    return [extractFunction(sorted, isDarwiniaPower), stakeOther || BN_ZERO, null, BN_ZERO];
  }

  const max = maxPaid.toNumber();
  const rewarded = sorted.slice(0, max);
  const rewardedTotal = sumValue(rewarded);
  const unrewarded = sorted.slice(max);
  const unrewardedTotal = sumValue(unrewarded);

  return [extractFunction(rewarded, isDarwiniaPower), rewardedTotal, extractFunction(unrewarded, isDarwiniaPower), unrewardedTotal];
}

function StakeOther ({ isDarwiniaPower, nominators, stakeOther }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const { t } = useTranslation();

  const [rewarded, rewardedTotal, unrewarded, unrewardedTotal] = useMemo(
    () => extractTotals(api.consts.staking?.maxNominatorRewardedPerValidator, nominators, isDarwiniaPower, stakeOther),
    [api, nominators, stakeOther, isDarwiniaPower]
  );

  return (
    <td className='expand all'>
      {rewarded && (
        <>
          <ExpanderScroll
            renderChildren={rewarded[1]}
            summary={
              <FormatBalance
                isDarwiniaPower = {isDarwiniaPower}
                labelPost={` (${rewarded[0]})`}
                value={isDarwiniaPower ? undefined : rewardedTotal}
                valueFormatted={isDarwiniaPower ? formatDarwiniaPower(rewardedTotal, t('power', 'power')) : undefined}
              />
            }
          />
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
        </>
      )}
    </td>
  );
}

export default React.memo(StakeOther);
