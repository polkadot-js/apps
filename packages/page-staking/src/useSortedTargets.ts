// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { DeriveSessionIndexes, DeriveStakingElected, DeriveStakingWaiting } from '@polkadot/api-derive/types';
import { Balance, ValidatorPrefsTo196 } from '@polkadot/types/interfaces';
import { SortedTargets, TargetSortBy, ValidatorInfo } from './types';

import BN from 'bn.js';
import { useMemo, useState } from 'react';
import { registry } from '@polkadot/react-api';
import { useAccounts, useApi, useCall, useDebounce } from '@polkadot/react-hooks';
import { Option } from '@polkadot/types';
import { BN_ONE, BN_ZERO, formatBalance } from '@polkadot/util';

const PERBILL = new BN(1_000_000_000);
const EMPTY_PARTIAL = {};

function baseBalance (): BN {
  return new BN('1'.padEnd(formatBalance.getDefaults().decimals + 4, '0'));
}

function mapIndex (mapBy: TargetSortBy): (info: ValidatorInfo, index: number) => ValidatorInfo {
  return (info, index): ValidatorInfo => {
    info[mapBy] = index + 1;

    return info;
  };
}

function sortValidators (list: ValidatorInfo[]): ValidatorInfo[] {
  return list
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
    .sort((a, b) => a.rewardSplit.cmp(b.rewardSplit))
    .map(mapIndex('rankReward'))
    .sort((a, b) => b.numNominators - a.numNominators)
    .map(mapIndex('rankNumNominators'))
    .sort((a, b): number => {
      const cmp = b.rewardPayout.cmp(a.rewardPayout);

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

function extractSingle (allAccounts: string[], amount: BN = baseBalance(), { info }: DeriveStakingElected | DeriveStakingWaiting, favorites: string[], perValidatorReward: BN, isElected: boolean): [ValidatorInfo[], string[]] {
  const nominators: Record<string, boolean> = {};
  const emptyExposure = registry.createType('Exposure');
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
    const rewardPayout = amount.isZero() || rewardSplit.isZero()
      ? BN_ZERO
      : amount.mul(rewardSplit).div(amount.add(bondTotal));
    const isNominating = (exposure.others || []).reduce((isNominating, indv): boolean => {
      const nominator = indv.who.toString();

      nominators[nominator] = true;

      return isNominating || allAccounts.includes(nominator);
    }, allAccounts.includes(key));

    return {
      accountId,
      bondOther: bondTotal.sub(bondOwn),
      bondOwn,
      bondShare: 0,
      bondTotal,
      commissionPer: ((validatorPrefs.commission?.unwrap() || BN_ZERO).toNumber() / 10_000_000),
      exposure,
      hasIdentity: false,
      isActive: !skipRewards,
      isCommission: !!validatorPrefs.commission,
      isElected,
      isFavorite: favorites.includes(key),
      isNominating,
      key,
      numNominators: (exposure.others || []).length,
      rankBondOther: 0,
      rankBondOwn: 0,
      rankBondTotal: 0,
      rankComm: 0,
      rankNumNominators: 0,
      rankOverall: 0,
      rankPayment: 0,
      rankReward: 0,
      rewardPayout: skipRewards ? BN_ZERO : rewardPayout,
      rewardSplit,
      validatorPayment,
      validatorPrefs
    };
  });

  return [list, Object.keys(nominators)];
}

function extractInfo (allAccounts: string[], amount: BN = baseBalance(), electedDerive: DeriveStakingElected, waitingDerive: DeriveStakingWaiting, favorites: string[], lastReward = BN_ONE): Partial<SortedTargets> {
  const perValidatorReward = lastReward.divn(electedDerive.info.length);
  const [elected, nominators] = extractSingle(allAccounts, amount, electedDerive, favorites, perValidatorReward, true);
  const [waiting] = extractSingle(allAccounts, amount, waitingDerive, favorites, perValidatorReward, false);
  const validators = sortValidators(elected.concat(waiting));
  const validatorIds = validators.map(({ accountId }) => accountId.toString());
  const activeTotals = elected
    .filter(({ isActive }) => isActive)
    .map(({ bondTotal }) => bondTotal)
    .sort((a, b) => a.cmp(b));
  const totalStaked = activeTotals.reduce((total: BN, value) => total.iadd(value), new BN(0));
  const avgStaked = totalStaked.divn(activeTotals.length);

  return { avgStaked, lowStaked: activeTotals[0] || BN_ZERO, nominators, totalStaked, validatorIds, validators };
}

const transformEra = {
  transform: ({ activeEra }: DeriveSessionIndexes) => activeEra.gtn(0) ? activeEra.subn(1) : BN_ZERO
};

const transformReward = {
  transform: (optBalance: Option<Balance>) => optBalance.unwrapOrDefault()
};

export default function useSortedTargets (favorites: string[]): SortedTargets {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const electedInfo = useCall<DeriveStakingElected>(api.derive.staking.electedInfo);
  const waitingInfo = useCall<DeriveStakingWaiting>(api.derive.staking.waitingInfo);
  const lastEra = useCall<BN>(api.derive.session.indexes, undefined, transformEra);
  const lastReward = useCall<BN>(lastEra && api.query.staking.erasValidatorReward, [lastEra], transformReward);
  const [calcWith, setCalcWith] = useState<BN | undefined>(baseBalance());
  const calcWithDebounce = useDebounce(calcWith);

  const partial = useMemo(
    () => electedInfo && waitingInfo
      ? extractInfo(allAccounts, calcWithDebounce, electedInfo, waitingInfo, favorites, lastReward)
      : EMPTY_PARTIAL,
    [allAccounts, calcWithDebounce, electedInfo, favorites, lastReward, waitingInfo]
  );

  return { ...partial, calcWith, lastReward, setCalcWith };
}
