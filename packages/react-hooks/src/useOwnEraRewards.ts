// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveStakerReward } from '@polkadot/api-derive/types';

import { useEffect, useState } from 'react';

import useApi from './useApi';
import useCall from './useCall';
import useIsMountedRef from './useIsMountedRef';
import { useOwnStashIds } from './useOwnStashes';

interface OwnRewards {
  allRewards?: Record<string, DeriveStakerReward[]>;
  rewardCount: number;
}

function getRewards ([[stashIds], available]: [[string[]], DeriveStakerReward[][]]): OwnRewards {
  const allRewards: Record<string, DeriveStakerReward[]> = {};

  stashIds.forEach((stashId, index): void => {
    allRewards[stashId] = available[index];
  });

  return {
    allRewards,
    rewardCount: Object.values(allRewards).filter((rewards) => rewards.length !== 0).length
  };
}

export default function useOwnEraRewards (): OwnRewards {
  const { api } = useApi();
  const mountedRef = useIsMountedRef();
  const stashIds = useOwnStashIds();
  const available = useCall<[[string[]], DeriveStakerReward[][]]>(stashIds && api.derive.staking?.stakerRewardsMulti, [stashIds], { withParams: true });
  const [state, setState] = useState<OwnRewards>({ rewardCount: 0 });

  useEffect((): void => {
    mountedRef.current && available && setState(
      getRewards(available)
    );
  }, [available, mountedRef]);

  return state;
}
