// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveSessionIndexes, DerivedStakingQuery, DeriveStakerReward } from '@polkadot/api-derive/types';
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

function useNextPayouts (onlyLatest?: boolean): [string, BN][] | undefined {
  const { api, isApiReady } = useApi();
  const stashIds = useOwnStashIds();
  const allInfo = useCall<DerivedStakingQuery[]>(isApiReady && stashIds && api.derive.staking?.queryMulti, stashIds);
  const indexes = useCall<DeriveSessionIndexes>(isApiReady && api.derive.session.indexes, []);
  const [nextPayouts, setNextPayouts] = useState<[string, BN][] | undefined>();

  useEffect((): void => {
    if (stashIds) {
      if (onlyLatest) {
        indexes && setNextPayouts(
          stashIds.map((stashId) => [stashId, indexes.activeEra.subn(1)])
        );
      } else if (allInfo) {
        setNextPayouts(
          allInfo
            .map(({ stakingLedger }, index) => [stashIds[index], stakingLedger?.lastReward?.unwrapOr(new BN(-1)).addn(1)])
            .filter((value): value is [string, EraIndex] => !!value[1])
        );
      }
    }
  }, [allInfo, indexes, onlyLatest, stashIds]);

  return nextPayouts;
}

function getRewards ([thesePayouts, theseRewards]: [[string, EraIndex][], DeriveStakerReward[][]], nextPayouts: [string, BN][]): OwnRewards {
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

export default function useOwnEraRewards (onlyLatest?: boolean): OwnRewards {
  const { api } = useApi();
  const nextPayouts = useNextPayouts(onlyLatest);
  const available = useCall<[[string, EraIndex][], DeriveStakerReward[][]]>(nextPayouts && api.derive.staking?.stakerRewardsMulti as any, nextPayouts, { withParams: true });
  const [state, setState] = useState<OwnRewards>({ rewardCount: 0 });

  useEffect((): void => {
    available && nextPayouts && setState(
      getRewards(available, nextPayouts)
    );
  }, [available, nextPayouts]);

  return state;
}
