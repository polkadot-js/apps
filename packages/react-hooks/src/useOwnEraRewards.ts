// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveStakerReward } from '@polkadot/api-derive/types';
import { EraIndex } from '@polkadot/types/interfaces';

import { useEffect, useState } from 'react';

import useApi from './useApi';
import useCall from './useCall';
import useIsMountedRef from './useIsMountedRef';
import { useOwnStashIds } from './useOwnStashes';

interface OwnRewards {
  allRewards?: Record<string, DeriveStakerReward[]>;
  isLoadingRewards: boolean;
  rewardCount: number;
}

function getRewards ([[stashIds], available]: [[string[]], DeriveStakerReward[][]]): OwnRewards {
  const allRewards: Record<string, DeriveStakerReward[]> = {};

  stashIds.forEach((stashId, index): void => {
    allRewards[stashId] = available[index].filter(({ eraReward }) => !eraReward.isZero());
  });

  return {
    allRewards,
    isLoadingRewards: false,
    rewardCount: Object.values(allRewards).filter((rewards) => rewards.length !== 0).length
  };
}

export default function useOwnEraRewards (maxEras?: number): OwnRewards {
  const { api } = useApi();
  const mountedRef = useIsMountedRef();
  const stashIds = useOwnStashIds();
  const allEras = useCall<EraIndex[]>(api.derive.staking?.erasHistoric, []);
  const [filteredEras, setFilteredEras] = useState<EraIndex[]>([]);
  const available = useCall<[[string[]], DeriveStakerReward[][]]>(!!filteredEras.length && stashIds && api.derive.staking?.stakerRewardsMultiEras, [stashIds, filteredEras], { withParams: true });
  const [state, setState] = useState<OwnRewards>({ isLoadingRewards: true, rewardCount: 0 });

  useEffect((): void => {
    setState({ isLoadingRewards: true, rewardCount: 0 });
  }, [maxEras]);

  useEffect((): void => {
    mountedRef.current && available && setState(
      getRewards(available)
    );
  }, [available, mountedRef]);

  useEffect((): void => {
    allEras && maxEras && setFilteredEras(
      allEras.reverse().filter((_, index) => index < maxEras).reverse()
    );
  }, [allEras, maxEras]);

  return state;
}
