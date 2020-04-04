// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveSessionIndexes, DeriveStakingQuery, DeriveStakerReward } from '@polkadot/api-derive/types';
import { EraIndex, StakingLedgerTo240 } from '@polkadot/types/interfaces';

import { useEffect, useState } from 'react';

import BN from 'bn.js';
import useApi from './useApi';
import useCall from './useCall';
import useIsMountedRef from './useIsMountedRef';
import { useOwnStashIds } from './useOwnStashes';

interface OwnRewards {
  allRewards?: Record<string, DeriveStakerReward[]>;
  rewardCount: number;
}

function filterInfo (stashIds: string[], allInfo: DeriveStakingQuery[], prevEra: BN, onlyLatest?: boolean): [string, BN, BN[]?][] {
  const payouts = allInfo
    .map(({ stakingLedger }, index): [string, BN?, BN[]?] =>
      stakingLedger
        ? stakingLedger.claimedRewards
          ? [stashIds[index], new BN(0), stakingLedger.claimedRewards]
          : (stakingLedger as any as StakingLedgerTo240).lastReward
            ? [stashIds[index], (stakingLedger as any as StakingLedgerTo240).lastReward.unwrapOr(new BN(-1)).addn(1), []]
            : [stashIds[index]]
        : [stashIds[index]]
    )
    .filter((value): value is [string, BN, BN[]?] => !!value[1]);

  return onlyLatest
    ? payouts
      .filter(([, era]) => era.lte(prevEra))
      .map(([stashId, , exclude]) => [stashId, prevEra, exclude])
    : payouts;
}

function useNextPayouts (onlyLatest?: boolean): [string, BN, BN[]?][] | undefined {
  const { api, isApiReady } = useApi();
  const mountedRef = useIsMountedRef();
  const stashIds = useOwnStashIds();
  const allInfo = useCall<DeriveStakingQuery[]>(isApiReady && stashIds && api.derive.staking?.queryMulti, stashIds);
  const indexes = useCall<DeriveSessionIndexes>(isApiReady && api.derive.session?.indexes, []);
  const [nextPayouts, setNextPayouts] = useState<[string, BN, BN[]?][] | undefined>();

  useEffect((): void => {
    mountedRef.current && stashIds && allInfo && indexes && setNextPayouts(
      filterInfo(stashIds, allInfo, indexes.activeEra.subn(1), onlyLatest)
    );
  }, [allInfo, indexes, mountedRef, onlyLatest, stashIds]);

  return nextPayouts;
}

function getRewards ([thesePayouts, theseRewards]: [[string, EraIndex][], DeriveStakerReward[][]], nextPayouts: [string, BN, BN[]?][]): OwnRewards {
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
  const mountedRef = useIsMountedRef();
  const nextPayouts = useNextPayouts(onlyLatest);
  const available = useCall<[[string, EraIndex][], DeriveStakerReward[][]]>(nextPayouts && api.derive.staking?.stakerRewardsMulti as any, nextPayouts, { withParams: true });
  const [state, setState] = useState<OwnRewards>({ rewardCount: 0 });

  useEffect((): void => {
    mountedRef.current && available && nextPayouts && setState(
      getRewards(available, nextPayouts)
    );
  }, [available, mountedRef, nextPayouts]);

  return state;
}
