// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DeriveEraPoints, DeriveEraRewards, DeriveStakerReward } from '@polkadot/api-derive/types';
import { EraIndex } from '@polkadot/types/interfaces';
import { StakerState } from './types';

import { useEffect, useState } from 'react';
import { registry } from '@polkadot/react-api';
import { BN_ZERO } from '@polkadot/util';

import useApi from './useApi';
import useCall from './useCall';
import useIsMountedRef from './useIsMountedRef';
import { useOwnStashIds } from './useOwnStashes';

interface State {
  allRewards?: Record<string, DeriveStakerReward[]> | null;
  isLoadingRewards: boolean;
  rewardCount: number;
}

interface ValidatorWithEras {
  eras: EraIndex[];
  stashId: string;
}

interface Filtered {
  filteredEras: EraIndex[];
  validatorEras: ValidatorWithEras[];
}

function getRewards ([[stashIds], available]: [[string[]], DeriveStakerReward[][]]): State {
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

function getValRewards (validatorEras: ValidatorWithEras[], erasPoints: DeriveEraPoints[], erasRewards: DeriveEraRewards[]): State {
  const allRewards: Record<string, DeriveStakerReward[]> = {};

  validatorEras.forEach(({ eras, stashId }): void => {
    eras.forEach((era): void => {
      const eraPoints = erasPoints.find((p) => p.era.eq(era));
      const eraRewards = erasRewards.find((r) => r.era.eq(era));

      if (eraPoints?.eraPoints.gt(BN_ZERO) && eraPoints?.validators[stashId] && eraRewards) {
        const reward = eraPoints.validators[stashId].mul(eraRewards.eraReward).div(eraPoints.eraPoints);

        if (!reward.isZero()) {
          const total = registry.createType('Balance', reward);

          if (!allRewards[stashId]) {
            allRewards[stashId] = [];
          }

          allRewards[stashId].push({
            era,
            eraReward: eraRewards.eraReward,
            isEmpty: false,
            isValidator: true,
            nominating: [],
            validators: {
              [stashId]: {
                total,
                value: total
              }
            }
          });
        }
      }
    });
  });

  return {
    allRewards,
    isLoadingRewards: false,
    rewardCount: Object.values(allRewards).filter((rewards) => rewards.length !== 0).length
  };
}

export default function useOwnEraRewards (maxEras?: number, ownValidators?: StakerState[]): State {
  const { api } = useApi();
  const mountedRef = useIsMountedRef();
  const stashIds = useOwnStashIds();
  const allEras = useCall<EraIndex[]>(api.derive.staking?.erasHistoric);
  const [{ filteredEras, validatorEras }, setFiltered] = useState<Filtered>({ filteredEras: [], validatorEras: [] });
  const [state, setState] = useState<State>({ isLoadingRewards: true, rewardCount: 0 });
  const stakerRewards = useCall<[[string[]], DeriveStakerReward[][]]>(!ownValidators?.length && !!filteredEras.length && stashIds && api.derive.staking?.stakerRewardsMultiEras, [stashIds, filteredEras], { withParams: true });
  const erasPoints = useCall<DeriveEraPoints[]>(!!validatorEras.length && !!filteredEras.length && api.derive.staking._erasPoints, [filteredEras, false]);
  const erasRewards = useCall<DeriveEraRewards[]>(!!validatorEras.length && !!filteredEras.length && api.derive.staking._erasRewards, [filteredEras, false]);

  useEffect((): void => {
    setState({ allRewards: null, isLoadingRewards: true, rewardCount: 0 });
  }, [maxEras, ownValidators]);

  useEffect((): void => {
    if (allEras && maxEras) {
      const filteredEras = allEras.slice(-1 * maxEras);
      const validatorEras: ValidatorWithEras[] = [];

      if (ownValidators?.length) {
        ownValidators.forEach(({ stakingLedger, stashId }): void => {
          if (stakingLedger) {
            const eras = filteredEras.filter((era) => !stakingLedger.claimedRewards.some((c) => era.eq(c)));

            if (eras.length) {
              validatorEras.push({ eras, stashId });
            }
          }
        });

        // When we have just claimed, we have filtered eras, but no validator eras - set accordingly
        if (filteredEras.length && !validatorEras.length) {
          setState({
            allRewards: {},
            isLoadingRewards: false,
            rewardCount: 0
          });
        }
      }

      setFiltered({ filteredEras, validatorEras });
    }
  }, [allEras, maxEras, ownValidators]);

  useEffect((): void => {
    mountedRef.current && stakerRewards && !ownValidators && setState(
      getRewards(stakerRewards)
    );
  }, [mountedRef, ownValidators, stakerRewards]);

  useEffect((): void => {
    mountedRef && erasPoints && erasRewards && ownValidators && setState(
      getValRewards(validatorEras, erasPoints, erasRewards)
    );
  }, [erasPoints, erasRewards, mountedRef, ownValidators, validatorEras]);

  return state;
}
