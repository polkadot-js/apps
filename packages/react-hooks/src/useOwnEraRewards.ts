// Copyright 2017-2022 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { DeriveEraPoints, DeriveEraRewards, DeriveStakerReward, DeriveStakingQuery } from '@polkadot/api-derive/types';
import type { AccountId, EraIndex } from '@polkadot/types/interfaces';
import type { DeriveStakerExposure, StakerState } from './types';

import { useEffect, useState } from 'react';
import { combineLatest, from, Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { DeriveEraPrefs, DeriveEraValPrefs } from '@polkadot/api-derive/staking/types';
import { rpcNetwork } from '@polkadot/react-api/util/getEnvironment';
import { PalletStakingStakingLedger } from '@polkadot/types/lookup';
import { BN, BN_BILLION, BN_ZERO } from '@polkadot/util';

import { createNamedHook } from './createNamedHook';
import { DarwiniaStakerReward, DeriveStakerRewardValidator } from './types';
import { useApi } from './useApi';
import { useCall } from './useCall';
import { useIsMountedRef } from './useIsMountedRef';
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

const EMPTY_FILTERED: Filtered = {
  filteredEras: [],
  validatorEras: []
};

const EMPTY_STATE: State = {
  isLoadingRewards: true,
  rewardCount: 0
};

const OPT_REWARDS = { withParams: true };

type ErasResult = [DeriveEraPoints[], DeriveEraPrefs[], DeriveEraRewards[]];

const allUniqueValidators = (rewards: DarwiniaStakerReward[][]): [string[], string[][]] => {
  return rewards.reduce(
    ([all, perStash]: [string[], string[][]], cur) => {
      const unique: string[] = [];

      perStash.push(unique);
      cur.forEach(({ validators }) =>
        Object.keys(validators).forEach((validatorId): void => {
          if (!unique.includes(validatorId)) {
            unique.push(validatorId);

            if (!all.includes(validatorId)) {
              all.push(validatorId);
            }
          }
        })
      );

      return [all, perStash];
    },
    [[], []]
  );
};

const removeClaimed = (validators: string[], queryValidators: DeriveStakingQuery[], reward: DarwiniaStakerReward): void => {
  const toBeRemoved: string[] = [];

  Object.keys(reward.validators).forEach((validatorId): void => {
    const index = validators.indexOf(validatorId);

    if (index !== -1) {
      const validatorLedger = queryValidators[index].stakingLedger;

      if (validatorLedger?.claimedRewards.some((e) => reward.era.eq(e))) {
        toBeRemoved.push(validatorId);
      }
    }
  });

  toBeRemoved.forEach((validatorId): void => {
    delete reward.validators[validatorId];
  });
};

const filterRewards = (
  eras: EraIndex[],
  validatorInfo: [string, DeriveStakingQuery][],
  { rewards, stakingLedger }: { rewards: DarwiniaStakerReward[]; stakingLedger: PalletStakingStakingLedger }
): DarwiniaStakerReward[] => {
  const filter = eras.filter((e) => !stakingLedger.claimedRewards.some((s) => s.eq(e)));
  const validators = validatorInfo.map(([v]) => v);
  const queryValidators = validatorInfo.map(([, q]) => q);

  return rewards
    .filter(({ isEmpty }) => !isEmpty)
    .filter((reward): boolean => {
      if (!filter.some((e) => reward.era.eq(e))) {
        return false;
      }

      removeClaimed(validators, queryValidators, reward);

      return true;
    })
    .filter(({ validators: source }) => Object.keys(source).length !== 0)
    .map((reward) => ({
      ...reward,
      nominators: reward.nominating.filter((n) => reward.validators[n.validatorId])
    }));
};

const parseRewards = (
  api: ApiPromise,
  stashId: AccountId,
  [erasPoints, erasPrefs, erasRewards]: ErasResult,
  exposures: DeriveStakerExposure[]
): DarwiniaStakerReward[] => {
  return exposures.map(({ era, isEmpty, isValidator, nominating, validators: eraValidators }): DarwiniaStakerReward => {
    const { eraPoints, validators: allValidatorPoints } = erasPoints.find((eraPoint) => eraPoint.era.eq(era)) || {
      eraPoints: BN_ZERO
    };
    const { eraReward } = erasRewards.find((r) => r.era.eq(era)) || { eraReward: api.registry.createType('Balance') };
    const { validators: allValidatorPrefs } = erasPrefs.find((eraPref) => eraPref.era.eq(era)) || { validators: {} as DeriveEraValPrefs };
    const validators: Record<string, DeriveStakerRewardValidator> = {};
    const stakerId = stashId.toString();
    let total = BN_ZERO;

    Object.entries(eraValidators).forEach(([validatorId, exposure]): void => {
      const validatorPoints = (allValidatorPoints && allValidatorPoints[validatorId]) || BN_ZERO;
      const validatorCommission = allValidatorPrefs[validatorId]?.commission.unwrap() || BN_ZERO;
      const totalExposure = exposure.totalPower;
      let totalAvailable = BN_ZERO;
      let value: BN | undefined;

      if (!totalExposure.isZero() || !validatorPoints.isZero() || !eraPoints.isZero()) {
        totalAvailable = eraReward.mul(validatorPoints).div(eraPoints);

        const validatorCut = validatorCommission.mul(totalAvailable).div(BN_BILLION);
        let staked: BN;

        if (validatorId === stakerId) {
          staked = exposure.ownPower;
        } else {
          const stakerExposure = exposure.others.find(({ who }) => who.eq(stakerId));

          staked = stakerExposure ? stakerExposure.power : BN_ZERO;
        }

        value = totalAvailable
          .sub(validatorCut)
          .imul(staked)
          .div(totalExposure)
          .iadd(validatorId === stakerId ? validatorCut : BN_ZERO);
        total = total.add(value);
      }

      validators[validatorId] = {
        total: api.createType('Balance', totalAvailable),
        value: api.createType('Balance', value)
      };
    });

    return {
      era,
      eraReward,
      isEmpty,
      isValidator,
      nominating,
      total: api.createType('Balance', total),
      validators
    };
  });
};

const getDarwiniaRewards = (api: ApiPromise, accountIds: string[], selectedEra: EraIndex[], withActive = false) => {
  return combineLatest([
    api.derive.staking.queryMulti(accountIds, { withLedger: true }),
    api.derive.staking._stakerExposures(accountIds, selectedEra, withActive),
    api.derive.staking._stakerRewardsEras(selectedEra, withActive)
  ]).pipe(
    switchMap(([queries, exposures, erasResult]): Observable<DarwiniaStakerReward[][]> => {
      const allRewards = queries.map(({ stakingLedger, stashId }, index): DarwiniaStakerReward[] =>
        !stashId || !stakingLedger
          ? []
          : parseRewards(api, stashId, erasResult, exposures[index] as unknown as DeriveStakerExposure[])
      );

      if (withActive) {
        return of(allRewards);
      }

      const [allValidators, stashValidators] = allUniqueValidators(allRewards);

      return from(api.derive.staking.queryMulti(allValidators, { withLedger: true })).pipe(
        map((validatorStakingQuery): DarwiniaStakerReward[][] =>
          queries.map(({ stakingLedger }, index): DarwiniaStakerReward[] =>
            filterRewards(
              selectedEra,
              stashValidators[index].map((validatorId): [string, DeriveStakingQuery] => [
                validatorId,
                validatorStakingQuery.find((query) => query.accountId.eq(validatorId)) as DeriveStakingQuery
              ]),
              {
                rewards: allRewards[index],
                stakingLedger
              }
            )
          )
        )
      );
    })
  );
};

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

function getValRewards (api: ApiPromise, validatorEras: ValidatorWithEras[], erasPoints: DeriveEraPoints[], erasRewards: DeriveEraRewards[]): State {
  const allRewards: Record<string, DeriveStakerReward[]> = {};

  validatorEras.forEach(({ eras, stashId }): void => {
    eras.forEach((era): void => {
      const eraPoints = erasPoints.find((p) => p.era.eq(era));
      const eraRewards = erasRewards.find((r) => r.era.eq(era));

      if (eraPoints?.eraPoints.gt(BN_ZERO) && eraPoints?.validators[stashId] && eraRewards) {
        const reward = eraPoints.validators[stashId].mul(eraRewards.eraReward).div(eraPoints.eraPoints);

        if (!reward.isZero()) {
          const total = api.createType('Balance', reward);

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

function useOwnEraRewardsImpl (maxEras?: number, ownValidators?: StakerState[], additional?: string[]): State {
  const { api } = useApi();
  const mountedRef = useIsMountedRef();
  const stashIds = useOwnStashIds(additional);
  const allEras = useCall<EraIndex[]>(api.derive.staking?.erasHistoric);
  const [{ filteredEras, validatorEras }, setFiltered] = useState<Filtered>(EMPTY_FILTERED);
  const [state, setState] = useState<State>(EMPTY_STATE);
  const stakerRewards = useCall<[[string[]], DeriveStakerReward[][]]>(!ownValidators?.length && !!filteredEras.length && stashIds && api.derive.staking?.stakerRewardsMultiEras, [stashIds, filteredEras], OPT_REWARDS);
  const [darwiniaStakerRewards, setDarwiniaStakerRewards] = useState<[[string[]], DarwiniaStakerReward[][]]>();
  const erasPoints = useCall<DeriveEraPoints[]>(!!validatorEras.length && !!filteredEras.length && api.derive.staking._erasPoints, [filteredEras, false]);
  const erasRewards = useCall<DeriveEraRewards[]>(!!validatorEras.length && !!filteredEras.length && api.derive.staking._erasRewards, [filteredEras, false]);
  const isDarwinia = rpcNetwork.isDarwinia();

  useEffect(() => {
    if (!stashIds || !isDarwinia) {
      return;
    }

    const res = getDarwiniaRewards(api, stashIds, filteredEras);

    res.subscribe((rewards) => {
      setDarwiniaStakerRewards(([[stashIds], rewards]));
    });
  }, [api, filteredEras, isDarwinia, stashIds]);

  useEffect((): void => {
    setState({ allRewards: null, isLoadingRewards: true, rewardCount: 0 });
  }, [maxEras, ownValidators]);

  useEffect((): void => {
    if (allEras && maxEras) {
      const filteredEras = allEras.slice(-1 * maxEras);
      const validatorEras: ValidatorWithEras[] = [];

      if (allEras.length === 0) {
        setState({
          allRewards: {},
          isLoadingRewards: false,
          rewardCount: 0
        });
        setFiltered({ filteredEras, validatorEras });
      } else if (ownValidators?.length) {
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
    mountedRef.current && stakerRewards && !ownValidators && !isDarwinia && setState(
      getRewards(stakerRewards)
    );
    mountedRef.current && darwiniaStakerRewards && isDarwinia && !ownValidators && setState(
      getRewards(darwiniaStakerRewards as unknown as [[string[]], DeriveStakerReward[][]])
    );
  }, [darwiniaStakerRewards, isDarwinia, mountedRef, ownValidators, stakerRewards]);

  useEffect((): void => {
    mountedRef && erasPoints && erasRewards && ownValidators && setState(
      getValRewards(api, validatorEras, erasPoints, erasRewards)
    );
  }, [api, erasPoints, erasRewards, mountedRef, ownValidators, validatorEras]);

  return state;
}

export const useOwnEraRewards = createNamedHook('useOwnEraRewards', useOwnEraRewardsImpl);
