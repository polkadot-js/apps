// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { DeriveSessionInfo, DeriveStakingElected, DeriveStakingWaiting } from '@polkadot/api-derive/types';
import type { Option } from '@polkadot/types';
import type { Balance, ValidatorPrefsTo196 } from '@polkadot/types/interfaces';
import type { SortedTargets, TargetSortBy, ValidatorInfo } from './types';

import BN from 'bn.js';
import { useMemo } from 'react';
import { registry } from '@polkadot/react-api';
import { calcInflation, useAccounts, useApi, useCall } from '@polkadot/react-hooks';
import { BN_ONE, BN_ZERO } from '@polkadot/util';

interface LastEra {
  eraLength: BN;
  lastEra: BN;
  lastEraEnd: BN;
  sessionLength: BN;
}

const PERBILL = new BN(1_000_000_000);
const EMPTY_PARTIAL = {};

function mapIndex (mapBy: TargetSortBy): (info: ValidatorInfo, index: number) => ValidatorInfo {
  return (info, index): ValidatorInfo => {
    info[mapBy] = index + 1;

    return info;
  };
}

function isWaitingDerive (derive: DeriveStakingElected | DeriveStakingWaiting): derive is DeriveStakingWaiting {
  return !(derive as DeriveStakingElected).nextElected;
}

function sortValidators (list: ValidatorInfo[]): ValidatorInfo[] {
  const existing: string[] = [];

  return list
    .filter((a): boolean => {
      const s = a.accountId.toString();

      if (!existing.includes(s)) {
        existing.push(s);

        return true;
      }

      return false;
    })
    .filter((a) => a.bondTotal.gtn(0))
    .sort((a, b) => b.commissionPer - a.commissionPer)
    .map(mapIndex('rankComm'))
    .sort((a, b) => b.bondOther.cmp(a.bondOther))
    .map(mapIndex('rankBondOther'))
    .sort((a, b) => b.bondOwn.cmp(a.bondOwn))
    .map(mapIndex('rankBondOwn'))
    .sort((a, b) => b.bondTotal.cmp(a.bondTotal))
    .map(mapIndex('rankBondTotal'))
    .sort((a, b) => b.validatorPayment.cmp(a.validatorPayment))
    .map(mapIndex('rankPayment'))
    .sort((a, b) => a.stakedReturnCmp - b.stakedReturnCmp)
    .map(mapIndex('rankReward'))
    .sort((a, b) => b.numNominators - a.numNominators)
    .map(mapIndex('rankNumNominators'))
    .sort((a, b): number => {
      const cmp = b.stakedReturnCmp - a.stakedReturnCmp;

      return cmp !== 0
        ? cmp
        : a.rankReward === b.rankReward
          ? a.rankPayment === b.rankPayment
            ? b.rankBondTotal - a.rankBondTotal
            : b.rankPayment - a.rankPayment
          : b.rankReward - a.rankReward;
    })
    .map(mapIndex('rankOverall'))
    .sort((a, b) =>
      a.isFavorite === b.isFavorite
        ? 0
        : (a.isFavorite ? -1 : 1)
    );
}

function extractSingle (allAccounts: string[], derive: DeriveStakingElected | DeriveStakingWaiting, favorites: string[], perValidatorReward: BN, { eraLength, lastEra, sessionLength }: LastEra): [ValidatorInfo[], string[]] {
  const nominators: Record<string, boolean> = {};
  const emptyExposure = registry.createType('Exposure');
  const info = derive.info;
  const list = info.map(({ accountId, exposure = emptyExposure, stakingLedger, validatorPrefs }): ValidatorInfo => {
    // some overrides (e.g. Darwinia Crab) does not have the own field in Exposure
    let bondOwn = exposure.own?.unwrap() || BN_ZERO;
    let bondTotal = exposure.total?.unwrap() || BN_ZERO;
    const skipRewards = bondTotal.isZero();

    if (bondTotal.isZero()) {
      bondTotal = bondOwn = stakingLedger.total.unwrap();
    }

    const validatorPayment = (validatorPrefs as unknown as ValidatorPrefsTo196).validatorPayment
      ? (validatorPrefs as unknown as ValidatorPrefsTo196).validatorPayment.unwrap() as BN
      : validatorPrefs.commission.unwrap().mul(perValidatorReward).div(PERBILL);
    const key = accountId.toString();
    const rewardSplit = perValidatorReward.sub(validatorPayment);
    const isNominating = (exposure.others || []).reduce((isNominating, indv): boolean => {
      const nominator = indv.who.toString();

      nominators[nominator] = true;

      return isNominating || allAccounts.includes(nominator);
    }, allAccounts.includes(key));
    const isElected = !isWaitingDerive(derive) && derive.nextElected.some((e) => e.eq(accountId));
    const lastEraPayout = !lastEra.isZero()
      ? stakingLedger.claimedRewards[stakingLedger.claimedRewards.length - 1]
      : undefined;
    let lastPayout: BN | undefined = lastEraPayout;

    if (lastPayout && !sessionLength.eq(BN_ONE)) {
      lastPayout = lastEra.sub(lastPayout).mul(eraLength);
    }

    return {
      accountId,
      bondOther: bondTotal.sub(bondOwn),
      bondOwn,
      bondShare: 0,
      bondTotal,
      commissionPer: ((validatorPrefs.commission?.unwrap() || BN_ZERO).toNumber() / 10_000_000),
      exposure,
      isActive: !skipRewards,
      isCommission: !!validatorPrefs.commission,
      isElected,
      isFavorite: favorites.includes(key),
      isNominating,
      key,
      lastPayout,
      numNominators: (exposure.others || []).length,
      rankBondOther: 0,
      rankBondOwn: 0,
      rankBondTotal: 0,
      rankComm: 0,
      rankNumNominators: 0,
      rankOverall: 0,
      rankPayment: 0,
      rankReward: 0,
      rewardSplit,
      skipRewards,
      stakedReturn: 0,
      stakedReturnCmp: 0,
      validatorPayment,
      validatorPrefs
    };
  });

  return [list, Object.keys(nominators)];
}

function extractInfo (api: ApiPromise, allAccounts: string[], electedDerive: DeriveStakingElected, waitingDerive: DeriveStakingWaiting, favorites: string[], totalIssuance: BN, lastEraInfo: LastEra, lastReward: BN): Partial<SortedTargets> {
  const perValidatorReward = lastReward.divn(electedDerive.info.length);
  const [elected, nominators] = extractSingle(allAccounts, electedDerive, favorites, perValidatorReward, lastEraInfo);
  const [waiting] = extractSingle(allAccounts, waitingDerive, favorites, perValidatorReward, lastEraInfo);
  const activeTotals = elected
    .filter(({ isActive }) => isActive)
    .map(({ bondTotal }) => bondTotal)
    .sort((a, b) => a.cmp(b));
  const totalStaked = activeTotals.reduce((total: BN, value) => total.iadd(value), new BN(0));
  const avgStaked = totalStaked.divn(activeTotals.length);
  const inflation = calcInflation(api, totalStaked, totalIssuance);

  // add the explicit stakedReturn
  !avgStaked.isZero() && elected.forEach((e): void => {
    if (!e.skipRewards) {
      e.stakedReturn = inflation.stakedReturn * avgStaked.muln(1_000_000).div(e.bondTotal).toNumber() / 1_000_000;
      e.stakedReturnCmp = e.stakedReturn * (100 - e.commissionPer) / 100;
    }
  });

  const validators = sortValidators(elected.concat(waiting));

  return {
    avgStaked,
    inflation,
    lowStaked: activeTotals[0] || BN_ZERO,
    nominators,
    totalIssuance,
    totalStaked,
    validatorIds: validators.map(({ accountId }) => accountId.toString()),
    validators
  };
}

const transformEra = {
  transform: ({ activeEra, activeEraStart, eraLength, sessionLength }: DeriveSessionInfo): LastEra => ({
    eraLength,
    lastEra: activeEra.gtn(0) ? activeEra.subn(1) : BN_ZERO,
    lastEraEnd: activeEra.gtn(0) && activeEraStart.isSome ? activeEraStart.unwrap() : BN_ZERO,
    sessionLength
  })
};

const transformReward = {
  transform: (optBalance: Option<Balance>) => optBalance.unwrapOrDefault()
};

export default function useSortedTargets (favorites: string[]): SortedTargets {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const totalIssuance = useCall<BN>(api.query.balances.totalIssuance);
  const electedInfo = useCall<DeriveStakingElected>(api.derive.staking.electedInfo);
  const waitingInfo = useCall<DeriveStakingWaiting>(api.derive.staking.waitingInfo);
  const lastEraInfo = useCall<LastEra>(api.derive.session.info, undefined, transformEra);
  const lastReward = useCall<BN>(lastEraInfo && api.query.staking.erasValidatorReward, [lastEraInfo?.lastEra], transformReward);

  const partial = useMemo(
    () => electedInfo && lastEraInfo && lastReward && totalIssuance && waitingInfo
      ? extractInfo(api, allAccounts, electedInfo, waitingInfo, favorites, totalIssuance, lastEraInfo, lastReward)
      : EMPTY_PARTIAL,
    [api, allAccounts, electedInfo, favorites, lastEraInfo, lastReward, totalIssuance, waitingInfo]
  );

  return { inflation: { inflation: 0, stakedReturn: 0 }, ...partial, lastReward };
}
