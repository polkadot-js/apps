// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { DeriveSessionInfo, DeriveStakingElected, DeriveStakingWaiting } from '@polkadot/api-derive/types';
import type { Inflation } from '@polkadot/react-hooks/types';
import type { Option, u32, Vec } from '@polkadot/types';
import type { PalletStakingStakingLedger } from '@polkadot/types/lookup';
import type { SortedTargets, TargetSortBy, ValidatorInfo } from './types.js';

import { useMemo } from 'react';

import { createNamedHook, useAccounts, useApi, useCall, useCallMulti, useInflation } from '@polkadot/react-hooks';
import { arrayFlatten, BN, BN_HUNDRED, BN_MAX_INTEGER, BN_ONE, BN_ZERO } from '@polkadot/util';

interface LastEra {
  activeEra: BN;
  eraLength: BN;
  lastEra: BN;
  sessionLength: BN;
}

interface MultiResult {
  counterForNominators?: BN;
  counterForValidators?: BN;
  historyDepth?: BN;
  maxNominatorsCount?: BN;
  maxValidatorsCount?: BN;
  minNominatorBond?: BN;
  minValidatorBond?: BN;
  totalIssuance?: BN;
}

interface OldLedger {
  claimedRewards: Vec<u32>;
}

const EMPTY_PARTIAL: Partial<SortedTargets> = {};
const DEFAULT_FLAGS_ELECTED = { withController: true, withExposure: true, withExposureMeta: true, withPrefs: true };
const DEFAULT_FLAGS_WAITING = { withController: true, withPrefs: true };

const OPT_ERA = {
  transform: ({ activeEra, eraLength, sessionLength }: DeriveSessionInfo): LastEra => ({
    activeEra,
    eraLength,
    lastEra: activeEra.isZero()
      ? BN_ZERO
      : activeEra.sub(BN_ONE),
    sessionLength
  })
};

const OPT_MULTI = {
  defaultValue: {},
  transform: ([historyDepth, counterForNominators, counterForValidators, optMaxNominatorsCount, optMaxValidatorsCount, minNominatorBond, minValidatorBond, totalIssuance]: [BN, BN?, BN?, Option<u32>?, Option<u32>?, BN?, BN?, BN?]): MultiResult => ({
    counterForNominators,
    counterForValidators,
    historyDepth,
    maxNominatorsCount: optMaxNominatorsCount && optMaxNominatorsCount.isSome
      ? optMaxNominatorsCount.unwrap()
      : undefined,
    maxValidatorsCount: optMaxValidatorsCount && optMaxValidatorsCount.isSome
      ? optMaxValidatorsCount.unwrap()
      : undefined,
    minNominatorBond,
    minValidatorBond,
    totalIssuance
  })
};

function getLegacyRewards (ledger: PalletStakingStakingLedger, claimedRewardsEras: Vec<u32>): u32[] {
  const legacyRewards = ledger.legacyClaimedRewards || (ledger as unknown as OldLedger).claimedRewards || [];

  return legacyRewards.concat(claimedRewardsEras.toArray());
}

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
    .filter(({ accountId }): boolean => {
      const key = accountId.toString();

      if (existing.includes(key)) {
        return false;
      } else {
        existing.push(key);

        return true;
      }
    })
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
  const emptyExposure = api.createType('SpStakingExposurePage');
  const emptyExposureMeta = api.createType('SpStakingPagedExposureMetadata');
  const earliestEra = historyDepth && lastEra.sub(historyDepth).iadd(BN_ONE);
  const list = new Array<ValidatorInfo>(derive.info.length);

  for (let i = 0; i < derive.info.length; i++) {
    const { accountId, claimedRewardsEras, exposureMeta, exposurePaged, stakingLedger, validatorPrefs } = derive.info[i];
    const exp = exposurePaged.isSome && exposurePaged.unwrap();
    const expMeta = exposureMeta.isSome && exposureMeta.unwrap();
    // some overrides (e.g. Darwinia Crab) does not have the own/total field in Exposure
    let [bondOwn, bondTotal] = exp && expMeta
      ? [expMeta.own.unwrap(), expMeta.total.unwrap()]
      : [BN_ZERO, BN_ZERO];

    const skipRewards = bondTotal.isZero();

    if (skipRewards) {
      bondTotal = bondOwn = stakingLedger.total?.unwrap() || BN_ZERO;
    }

    // some overrides (e.g. Darwinia Crab) does not have the value field in IndividualExposure
    const minNominated = ((exp && exp.others) || []).reduce((min: BN, { value = api.createType('Compact<Balance>') }): BN => {
      const actual = value.unwrap();

      return min.isZero() || actual.lt(min)
        ? actual
        : min;
    }, BN_ZERO);

    const key = accountId.toString();
    const rewards = getLegacyRewards(stakingLedger, claimedRewardsEras);

    const lastEraPayout = !lastEra.isZero()
      ? rewards[rewards.length - 1]
      : undefined;

    list[i] = {
      accountId,
      bondOther: bondTotal.sub(bondOwn),
      bondOwn,
      bondShare: 0,
      bondTotal,
      commissionPer: validatorPrefs.commission.unwrap().toNumber() / 10_000_000,
      exposureMeta: expMeta || emptyExposureMeta,
      exposurePaged: exp || emptyExposure,
      isActive: !skipRewards,
      isBlocking: !!(validatorPrefs.blocked && validatorPrefs.blocked.isTrue),
      isElected: !isWaitingDerive(derive) && derive.nextElected.some((e) => e.eq(accountId)),
      isFavorite: favorites.includes(key),
      isNominating: ((exp && exp.others) || []).reduce((isNominating, indv): boolean => {
        const nominator = indv.who.toString();

        nominators[nominator] = (nominators[nominator] || BN_ZERO).add(indv.value?.toBn() || BN_ZERO);

        return isNominating || allAccounts.includes(nominator);
      }, allAccounts.includes(key)),
      key,
      knownLength: activeEra.sub(rewards[0] || activeEra),
      // only use if it is more recent than historyDepth
      lastPayout: earliestEra && lastEraPayout && lastEraPayout.gt(earliestEra) && !sessionLength.eq(BN_ONE)
        ? lastEra.sub(lastEraPayout).mul(eraLength)
        : undefined,
      minNominated,
      numNominators: ((exp && exp.others) || []).length,
      numRecentPayouts: earliestEra
        ? rewards.filter((era) => era.gte(earliestEra)).length
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
  }

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
    lastEra: lastEraInfo.lastEra,
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

function useSortedTargetsImpl (favorites: string[], withLedger: boolean, apiOverride?: ApiPromise): SortedTargets {
  const { api: connectedApi } = useApi();
  const api = useMemo(() => apiOverride ?? connectedApi, [apiOverride, connectedApi]);
  const { allAccounts } = useAccounts();
  const { counterForNominators, counterForValidators, historyDepth, maxNominatorsCount, maxValidatorsCount, minNominatorBond, minValidatorBond, totalIssuance } = useCallMulti<MultiResult>([
    api.query.staking.historyDepth,
    api.query.staking.counterForNominators,
    api.query.staking.counterForValidators,
    api.query.staking.maxNominatorsCount,
    api.query.staking.maxValidatorsCount,
    api.query.staking.minNominatorBond,
    api.query.staking.minValidatorBond,
    api.query.balances?.totalIssuance
  ], OPT_MULTI);
  const electedInfo = useCall<DeriveStakingElected>(api.derive.staking.electedInfo, [{ ...DEFAULT_FLAGS_ELECTED, withClaimedRewardsEras: withLedger, withLedger }]);
  const waitingInfo = useCall<DeriveStakingWaiting>(api.derive.staking.waitingInfo, [{ ...DEFAULT_FLAGS_WAITING, withClaimedRewardsEras: withLedger, withLedger }]);
  const lastEraInfo = useCall<LastEra>(api.derive.session.info, undefined, OPT_ERA);

  const baseInfo = useMemo(
    () => electedInfo && lastEraInfo && totalIssuance && waitingInfo
      ? extractBaseInfo(api, allAccounts, electedInfo, waitingInfo, favorites, totalIssuance, lastEraInfo, api.consts.staking.historyDepth || historyDepth)
      : EMPTY_PARTIAL,
    [api, allAccounts, electedInfo, favorites, historyDepth, lastEraInfo, totalIssuance, waitingInfo]
  );

  const inflation = useInflation(baseInfo?.totalStaked);

  return useMemo(
    (): SortedTargets => ({
      counterForNominators,
      counterForValidators,
      historyDepth: api.consts.staking.historyDepth || historyDepth,
      inflation,
      maxNominatorsCount,
      maxValidatorsCount,
      medianComm: 0,
      minNominated: BN_ZERO,
      minNominatorBond,
      minValidatorBond,
      ...(
        inflation?.stakedReturn
          ? addReturns(inflation, baseInfo)
          : baseInfo
      )
    }),
    [api, baseInfo, counterForNominators, counterForValidators, historyDepth, inflation, maxNominatorsCount, maxValidatorsCount, minNominatorBond, minValidatorBond]
  );
}

export default createNamedHook('useSortedTargets', useSortedTargetsImpl);
