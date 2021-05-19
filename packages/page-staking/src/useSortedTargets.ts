// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { DeriveSessionInfo, DeriveStakingElected, DeriveStakingWaiting } from '@polkadot/api-derive/types';
import type { Inflation } from '@polkadot/react-hooks/types';
import type { SortedTargets, TargetSortBy, ValidatorInfo } from './types';

import BN from 'bn.js';
import { useMemo } from 'react';

import { useAccounts, useApi, useCall, useInflation } from '@polkadot/react-hooks';
import { arrayFlatten, BN_HUNDRED, BN_MAX_INTEGER, BN_ONE, BN_ZERO } from '@polkadot/util';

interface LastEra {
  activeEra: BN;
  eraLength: BN;
  lastEra: BN;
  sessionLength: BN;
}

const EMPTY_PARTIAL: Partial<SortedTargets> = {};
const DEFAULT_FLAGS_ELECTED = { withController: true, withExposure: true, withPrefs: true };
const DEFAULT_FLAGS_WAITING = { withController: true, withPrefs: true };

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
    // .filter((a) => a.bondTotal.gtn(0))
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

function extractSingle (api: ApiPromise, allAccounts: string[], derive: DeriveStakingElected | DeriveStakingWaiting, favorites: string[], { activeEra, eraLength, lastEra, sessionLength }: LastEra, historyDepth?: BN, withReturns?: boolean): [ValidatorInfo[], Record<string, BN>] {
  const nominators: Record<string, BN> = {};
  const emptyExposure = api.createType('Exposure');
  const earliestEra = historyDepth && lastEra.sub(historyDepth).iadd(BN_ONE);
  const list = derive.info.map(({ accountId, exposure = emptyExposure, stakingLedger, validatorPrefs }): ValidatorInfo => {
    // some overrides (e.g. Darwinia Crab) does not have the own/total field in Exposure
    let [bondOwn, bondTotal] = exposure.total
      ? [exposure.own.unwrap(), exposure.total.unwrap()]
      : [BN_ZERO, BN_ZERO];
    const skipRewards = bondTotal.isZero();
    // some overrides (e.g. Darwinia Crab) does not have the value field in IndividualExposure
    const minNominated = (exposure.others || []).reduce((min: BN, { value = api.createType('Compact<Balance>') }): BN => {
      const actual = value.unwrap();

      return min.isZero() || actual.lt(min)
        ? actual
        : min;
    }, BN_ZERO);

    if (bondTotal.isZero()) {
      bondTotal = bondOwn = stakingLedger.total?.unwrap() || BN_ZERO;
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
      commissionPer: validatorPrefs.commission.unwrap().toNumber() / 10_000_000,
      exposure,
      isActive: !skipRewards,
      isBlocking: !!(validatorPrefs.blocked && validatorPrefs.blocked.isTrue),
      isElected: !isWaitingDerive(derive) && derive.nextElected.some((e) => e.eq(accountId)),
      isFavorite: favorites.includes(key),
      isNominating: (exposure.others || []).reduce((isNominating, indv): boolean => {
        const nominator = indv.who.toString();

        nominators[nominator] = (nominators[nominator] || BN_ZERO).add(indv.value?.toBn() || BN_ZERO);

        return isNominating || allAccounts.includes(nominator);
      }, allAccounts.includes(key)),
      key,
      knownLength: activeEra.sub(stakingLedger.claimedRewards[0] || activeEra),
      lastPayout,
      minNominated,
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
      validatorPrefs,
      withReturns
    };
  });

  return [list, nominators];
}

function addReturns (inflation: Inflation, baseInfo: Partial<SortedTargets>): Partial<SortedTargets> {
  const avgStaked = baseInfo.avgStaked;
  const validators = baseInfo.validators;

  if (!validators) {
    return baseInfo;
  }

  avgStaked && !avgStaked.isZero() && validators.forEach((v): void => {
    if (!v.skipRewards && v.withReturns) {
      const adjusted = avgStaked.mul(BN_HUNDRED).imuln(inflation.stakedReturn).div(v.bondTotal);

      // in some cases, we may have overflows... protect against those
      v.stakedReturn = (adjusted.gt(BN_MAX_INTEGER) ? BN_MAX_INTEGER : adjusted).toNumber() / BN_HUNDRED.toNumber();
      v.stakedReturnCmp = v.stakedReturn * (100 - v.commissionPer) / 100;
    }
  });

  return { ...baseInfo, validators: sortValidators(validators) };
}

function extractBaseInfo (api: ApiPromise, allAccounts: string[], electedDerive: DeriveStakingElected, waitingDerive: DeriveStakingWaiting, favorites: string[], totalIssuance: BN, lastEraInfo: LastEra, historyDepth?: BN): Partial<SortedTargets> {
  const [elected, nominators] = extractSingle(api, allAccounts, electedDerive, favorites, lastEraInfo, historyDepth, true);
  const [waiting] = extractSingle(api, allAccounts, waitingDerive, favorites, lastEraInfo);
  const activeTotals = elected
    .filter(({ isActive }) => isActive)
    .map(({ bondTotal }) => bondTotal)
    .sort((a, b) => a.cmp(b));
  const totalStaked = activeTotals.reduce((total: BN, value) => total.iadd(value), new BN(0));
  const avgStaked = totalStaked.divn(activeTotals.length);

  // all validators, calc median commission
  const minNominated = Object.values(nominators).reduce((min: BN, value) => {
    return min.isZero() || value.lt(min)
      ? value
      : min;
  }, BN_ZERO);
  const validators = arrayFlatten([elected, waiting]);
  const commValues = validators.map(({ commissionPer }) => commissionPer).sort((a, b) => a - b);
  const midIndex = Math.floor(commValues.length / 2);
  const medianComm = commValues.length
    ? commValues.length % 2
      ? commValues[midIndex]
      : (commValues[midIndex - 1] + commValues[midIndex]) / 2
    : 0;

  // ids
  const waitingIds = waiting.map(({ key }) => key);
  const validatorIds = arrayFlatten([
    elected.map(({ key }) => key),
    waitingIds
  ]);
  const nominateIds = arrayFlatten([
    elected.filter(({ isBlocking }) => !isBlocking).map(({ key }) => key),
    waiting.filter(({ isBlocking }) => !isBlocking).map(({ key }) => key)
  ]);

  return {
    avgStaked,
    lowStaked: activeTotals[0] || BN_ZERO,
    medianComm,
    minNominated,
    nominateIds,
    nominators: Object.keys(nominators),
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

export default function useSortedTargets (favorites: string[], withLedger: boolean): SortedTargets {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const historyDepth = useCall<BN>(api.query.staking.historyDepth);
  const totalIssuance = useCall<BN>(api.query.balances?.totalIssuance);
  const electedInfo = useCall<DeriveStakingElected>(api.derive.staking.electedInfo, [{ ...DEFAULT_FLAGS_ELECTED, withLedger }]);
  const waitingInfo = useCall<DeriveStakingWaiting>(api.derive.staking.waitingInfo, [{ ...DEFAULT_FLAGS_WAITING, withLedger }]);
  const lastEraInfo = useCall<LastEra>(api.derive.session.info, undefined, transformEra);

  const baseInfo = useMemo(
    () => electedInfo && lastEraInfo && totalIssuance && waitingInfo
      ? extractBaseInfo(api, allAccounts, electedInfo, waitingInfo, favorites, totalIssuance, lastEraInfo, historyDepth)
      : EMPTY_PARTIAL,
    [api, allAccounts, electedInfo, favorites, historyDepth, lastEraInfo, totalIssuance, waitingInfo]
  );

  const inflation = useInflation(baseInfo?.totalStaked);

  const partial = useMemo(
    () => inflation
      ? addReturns(inflation, baseInfo)
      : baseInfo,
    [baseInfo, inflation]
  );

  return { inflation, medianComm: 0, minNominated: BN_ZERO, ...partial };
}
