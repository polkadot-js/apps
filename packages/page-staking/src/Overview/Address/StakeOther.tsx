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

function StakeOther ({ nominators, stakeOther }: Props): React.ReactElement<Props> {
  const { api } = useApi();

  const [rewarded, rewardedTotal, unrewarded, unrewardedTotal] = useMemo(
    (): [[string, Balance][], BN, [string, Balance][], BN] => {
      const sorted = nominators.sort((a, b) => b[1].cmp(a[1]));
      const max = api.consts.staking?.maxNominatorRewardedPerValidator?.toNumber();

      if (!max || sorted.length <= max) {
        return [sorted, stakeOther || BN_ZERO, [], BN_ZERO];
      }

      const rewarded = sorted.slice(0, max);
      const rewardedTotal = rewarded.reduce((total, [, value]) => total.iadd(value), new BN(0));
      const unrewarded = sorted.slice(max);
      const unrewardedTotal = unrewarded.reduce((total, [, value]) => total.iadd(value), new BN(0));

      return [rewarded, rewardedTotal, unrewarded, unrewardedTotal];
    },
    [api, nominators, stakeOther]
  );

  return (
    <td className='expand all'>
      {!!rewarded.length && (
        <>
          <Expander summary={
            <FormatBalance
              labelPost={` (${rewarded.length})`}
              value={rewardedTotal}
            />
          }>
            {rewarded.map(([who, bonded]): React.ReactNode =>
              <AddressMini
                bonded={bonded}
                key={who}
                value={who}
                withBonded
              />
            )}
          </Expander>
          {!!unrewarded.length && (
            <Expander
              className='stakeOver'
              summary={
                <FormatBalance
                  labelPost={` (${unrewarded.length})`}
                  value={unrewardedTotal}
                />
              }
            >
              {unrewarded.map(([who, bonded]): React.ReactNode =>
                <AddressMini
                  bonded={bonded}
                  key={who}
                  value={who}
                  withBonded
                />
              )}
            </Expander>
          )}
        </>
      )}
    </td>
  );
}

export default React.memo(StakeOther);
