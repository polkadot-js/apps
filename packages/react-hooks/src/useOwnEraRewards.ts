// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedStakingQuery, DeriveStakerReward } from '@polkadot/api-derive/types';
import { EraIndex } from '@polkadot/types/interfaces';

import { useEffect, useState } from 'react';

import BN from 'bn.js';
import useApi from './useApi';
import useCall from './useCall';
import { useOwnStashIds } from './useOwnStashes';

interface OwnRewards {
  allRewards?: Record<string, DeriveStakerReward[]>;
  rewardCount: number;
}

function useNextPayouts (): [string, EraIndex][] | undefined {
  const { api } = useApi();
  const stashIds = useOwnStashIds();
  const allInfo = useCall<DerivedStakingQuery[]>(stashIds && api.derive.staking?.queryMulti, stashIds);
  const [nextPayouts, setNextPayouts] = useState<[string, EraIndex][] | undefined>();

  useEffect((): void => {
    stashIds && allInfo && setNextPayouts(
      allInfo
        .map(({ stakingLedger }, index) => [stashIds[index], stakingLedger?.lastReward?.unwrapOr(new BN(-1)).addn(1)])
        .filter((value): value is [string, EraIndex] => !!value[1])
    );
  }, [allInfo, stashIds]);

  return nextPayouts;
}

function getRewards ([thesePayouts, theseRewards]: [[string, EraIndex][], DeriveStakerReward[][]], nextPayouts: [string, EraIndex][]): OwnRewards {
  const allRewards = theseRewards.reduce((result: Record<string, DeriveStakerReward[]>, rewards, index): Record<string, DeriveStakerReward[]> => {
    const [stashId] = thesePayouts[index];
    const nextPayout = nextPayouts.find(([thisId]) => thisId === stashId);

    if (nextPayout) {
      result[stashId] = rewards.filter(({ era, isEmpty }) => !isEmpty && era.gte(nextPayout[1]));
    }

    return result;
  }, {});

  return {
    allRewards,
    rewardCount: Object.values(allRewards).filter((rewards) => !!rewards.length).length
  };
}

export default function useOwnEraRewards (): OwnRewards {
  const { api } = useApi();
  const nextPayouts = useNextPayouts();
  const available = useCall<[[string, EraIndex][], DeriveStakerReward[][]]>(nextPayouts && api.derive.staking?.stakerRewardsMulti as any, nextPayouts, { withParams: true });
  const [state, setState] = useState<OwnRewards>({ rewardCount: 0 });

  useEffect((): void => {
    available && nextPayouts && setState(
      getRewards(available, nextPayouts)
    );
  }, [available, nextPayouts]);

  return state;
}
