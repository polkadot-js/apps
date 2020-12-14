// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { DeriveSessionInfo, DeriveStakingElected, DeriveStakingWaiting } from '@polkadot/api-derive/types';
import type { SortedTargets, TargetSortBy, ValidatorInfo } from './types';

import BN from 'bn.js';
import { useMemo } from 'react';

import { registry } from '@polkadot/react-api';
import { calcInflation, useAccounts, useApi, useCall } from '@polkadot/react-hooks';
import { BN_ONE, BN_ZERO } from '@polkadot/util';

interface LastEra {
  activeEra: BN;
  eraLength: BN;
  lastEra: BN;
  sessionLength: BN;
}

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
    // ignored, not used atm
    // .sort((a, b) => b.commissionPer - a.commissionPer)
    // .map(mapIndex('rankComm'))
    .sort((a, b) => b.bondOther.cmp(a.bondOther))
    .map(mapIndex('rankBondOther'))
    .sort((a, b) => b.bondOwn.cmp(a.bondOwn))
    .map(mapIndex('rankBondOwn'))
    .sort((a, b) => b.bondTotal.cmp(a.bondTotal))
    .map(mapIndex('rankBondTotal'))
    // .sort((a, b) => b.validatorPayment.cmp(a.validatorPayment))
    // .map(mapIndex('rankPayment'))
    .sort((a, b) => a.stakedReturnCmp - b.stakedReturnCmp)
    .map(mapIndex('rankReward'))
    // ignored, not used atm
    // .sort((a, b) => b.numNominators - a.numNominators)
    // .map(mapIndex('rankNumNominators'))
    .sort((a, b) =>
      (b.stakedReturnCmp - a.stakedReturnCmp) ||
      (a.commissionPer - b.commissionPer) ||
      (b.rankBondTotal - a.rankBondTotal)
    )
    .map(mapIndex('rankOverall'))
    .sort((a, b) =>
      a.isFavorite === b.isFavorite
        ? 0
        : (a.isFavorite ? -1 : 1)
    );
}

function extractSingle (allAccounts: string[], derive: DeriveStakingElected | DeriveStakingWaiting, favorites: string[], { activeEra, eraLength, lastEra, sessionLength }: LastEra, historyDepth?: BN): [ValidatorInfo[], string[]] {
  const nominators: Record<string, boolean> = {};
  const emptyExposure = registry.createType('Exposure');
  const earliestEra = historyDepth && lastEra.sub(historyDepth).addn(1);
  const list = derive.info.map(({ accountId, exposure = emptyExposure, stakingLedger, validatorPrefs }): ValidatorInfo => {
    // some overrides (e.g. Darwinia Crab) does not have the own field in Exposure
    let bondOwn = exposure.own?.unwrap() || BN_ZERO;
    let bondTotal = exposure.total?.unwrap() || BN_ZERO;
    const skipRewards = bondTotal.isZero();

    if (bondTotal.isZero()) {
      bondTotal = bondOwn = stakingLedger.total.unwrap();
    }

    const key = accountId.toString();
    const lastEraPayout = !lastEra.isZero()
      ? stakingLedger.claimedRewards[stakingLedger.claimedRewards.length - 1]
      : undefined;

    // only use if it is more recent than historyDepth
    let lastPayout: BN | undefined = earliestEra && lastEraPayout && lastEraPayout.gt(earliestEra)
      ? lastEraPayout
      : undefined;

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
      isElected: !isWaitingDerive(derive) && derive.nextElected.some((e) => e.eq(accountId)),
      isFavorite: favorites.includes(key),
      isNominating: (exposure.others || []).reduce((isNominating, indv): boolean => {
        const nominator = indv.who.toString();

        nominators[nominator] = true;

        return isNominating || allAccounts.includes(nominator);
      }, allAccounts.includes(key)),
      key,
      knownLength: activeEra.sub(stakingLedger.claimedRewards[0] || activeEra),
      lastPayout,
      numNominators: (exposure.others || []).length,
      numRecentPayouts: earliestEra
        ? stakingLedger.claimedRewards.filter((era) => era.gte(earliestEra)).length
        : 0,
      rankBondOther: 0,
      rankBondOwn: 0,
      rankBondTotal: 0,
      rankNumNominators: 0,
      rankOverall: 0,
      rankReward: 0,
      skipRewards,
      stakedReturn: 0,
      stakedReturnCmp: 0,
      validatorPrefs
    };
  });

  return [list, Object.keys(nominators)];
}

function extractInfo (api: ApiPromise, allAccounts: string[], electedDerive: DeriveStakingElected, waitingDerive: DeriveStakingWaiting, favorites: string[], totalIssuance: BN, lastEraInfo: LastEra, historyDepth?: BN): Partial<SortedTargets> {
  const [elected, nominators] = extractSingle(allAccounts, electedDerive, favorites, lastEraInfo, historyDepth);
  const [waiting] = extractSingle(allAccounts, waitingDerive, favorites, lastEraInfo);
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

  // all validators, calc median commission
  const validators = sortValidators(elected.concat(waiting));
  const commValues = validators.map(({ commissionPer }) => commissionPer).sort((a, b) => a - b);
  const midIndex = Math.floor(commValues.length / 2);
  const medianComm = commValues.length
    ? commValues.length % 2
      ? commValues[midIndex]
      : (commValues[midIndex - 1] + commValues[midIndex]) / 2
    : 0;

  // ids
  const electedIds = elected.map(({ accountId }) => accountId.toString());
  const waitingIds = waiting.map(({ accountId }) => accountId.toString());
  const validatorIds = electedIds.concat(waitingIds);

  return {
    avgStaked,
    inflation,
    lowStaked: activeTotals[0] || BN_ZERO,
    medianComm,
    nominators,
    totalIssuance,
    totalStaked,
    validatorIds,
    validators,
    waitingIds
  };
}

const transformEra = {
  transform: ({ activeEra, eraLength, sessionLength }: DeriveSessionInfo): LastEra => ({
    activeEra,
    eraLength,
    lastEra: activeEra.isZero() ? BN_ZERO : activeEra.subn(1),
    sessionLength
  })
};

export default function useSortedTargets (favorites: string[]): SortedTargets {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const historyDepth = useCall<BN>(api.query.staking.historyDepth);
  const totalIssuance = useCall<BN>(api.query.balances.totalIssuance);
  const electedInfo = useCall<DeriveStakingElected>(api.derive.staking.electedInfo);
  const waitingInfo = useCall<DeriveStakingWaiting>(api.derive.staking.waitingInfo);
  const lastEraInfo = useCall<LastEra>(api.derive.session.info, undefined, transformEra);

  const partial = useMemo(
    () => electedInfo && lastEraInfo && totalIssuance && waitingInfo
      ? extractInfo(api, allAccounts, electedInfo, waitingInfo, favorites, totalIssuance, lastEraInfo, historyDepth)
      : EMPTY_PARTIAL,
    [api, allAccounts, electedInfo, favorites, historyDepth, lastEraInfo, totalIssuance, waitingInfo]
  );

  return { inflation: { inflation: 0, stakedReturn: 0 }, medianComm: 0, ...partial };
}
