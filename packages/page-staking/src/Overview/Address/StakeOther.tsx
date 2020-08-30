// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useMemo } from 'react';
import { AddressMini, Expander } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';

import { MAX_NOM_PAYOUTS } from '../../constants';

interface Props {
  stakeOther?: BN;
  nominators: [string, Balance][];
}

function StakeOther ({ nominators }: Props): React.ReactElement<Props> {
  const { api } = useApi();

  const [rewarded, rewardedTotal, unrewarded, unrewardedTotal] = useMemo(
    (): [[string, Balance][], BN, [string, Balance][], BN] => {
      const sorted = nominators.sort((a, b) => b[1].cmp(a[1]));
      const max = (api.consts.staking?.maxNominatorRewardedPerValidator || MAX_NOM_PAYOUTS).toNumber();
      const rewarded = sorted.slice(0, max);
      const rewardedTotal = rewarded.reduce((total, [, value]) => total.iadd(value), new BN(0));
      const unrewarded = sorted.slice(max);
      const unrewardedTotal = unrewarded.reduce((total, [, value]) => total.iadd(value), new BN(0));

      return [rewarded, rewardedTotal, unrewarded, unrewardedTotal];
    },
    [api, nominators]
  );

  return (
    <td className='number all'>
      {rewarded.length > 0 && (
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
          {unrewarded.length > 0 && (
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
