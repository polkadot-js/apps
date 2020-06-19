// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveSessionIndexes, DeriveStakingElected } from '@polkadot/api-derive/types';
import { Balance, ValidatorPrefs, ValidatorPrefsTo196 } from '@polkadot/types/interfaces';
import { SortedTargets, TargetSortBy, ValidatorInfo } from './types';

import BN from 'bn.js';
import { useEffect, useState } from 'react';
import { registry } from '@polkadot/react-api';
import { useAccounts, useApi, useCall, useDebounce, useFavorites } from '@polkadot/react-hooks';
import { Option } from '@polkadot/types';
import { BN_ONE, BN_ZERO, formatBalance } from '@polkadot/util';

import { STORE_FAVS_BASE } from './constants';

const PERBILL = new BN(1_000_000_000);

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

function extractInfo (allAccounts: string[], amount: BN = baseBalance(), electedInfo: DeriveStakingElected, favorites: string[], lastReward = BN_ONE): Partial<SortedTargets> {
  const nominators: string[] = [];
  let totalStaked = BN_ZERO;
  const perValidatorReward = lastReward.divn(electedInfo.info.length);
  const validators = sortValidators(
    electedInfo.info.map(({ accountId, exposure: _exposure, validatorPrefs }): ValidatorInfo => {
      const exposure = _exposure || {
        others: registry.createType('Vec<IndividualExposure>'),
        own: registry.createType('Compact<Balance>'),
        total: registry.createType('Compact<Balance>')
      };
      const prefs = (validatorPrefs as (ValidatorPrefs | ValidatorPrefsTo196)) || {
        commission: registry.createType('Compact<Perbill>')
      };
      const bondOwn = exposure.own.unwrap();
      const bondTotal = exposure.total.unwrap();
      const validatorPayment = (prefs as ValidatorPrefsTo196).validatorPayment
        ? (prefs as ValidatorPrefsTo196).validatorPayment.unwrap() as BN
        : (prefs as ValidatorPrefs).commission.unwrap().mul(perValidatorReward).div(PERBILL);
      const key = accountId.toString();
      const rewardSplit = perValidatorReward.sub(validatorPayment);
      const rewardPayout = amount.isZero() || rewardSplit.isZero()
        ? BN_ZERO
        : amount.mul(rewardSplit).div(amount.add(bondTotal));
      const isNominating = exposure.others.reduce((isNominating, indv): boolean => {
        const nominator = indv.who.toString();

        if (!nominators.includes(nominator)) {
          nominators.push(nominator);
        }

        return isNominating || allAccounts.includes(nominator);
      }, allAccounts.includes(key));

      totalStaked = totalStaked.add(bondTotal);

      return {
        accountId,
        bondOther: bondTotal.sub(bondOwn),
        bondOwn,
        bondShare: 0,
        bondTotal,
        commissionPer: (((prefs as ValidatorPrefs).commission?.unwrap() || BN_ZERO).toNumber() / 10_000_000),
        isCommission: !!(prefs as ValidatorPrefs).commission,
        isFavorite: favorites.includes(key),
        isNominating,
        key,
        numNominators: exposure.others.length,
        rankBondOther: 0,
        rankBondOwn: 0,
        rankBondTotal: 0,
        rankComm: 0,
        rankOverall: 0,
        rankPayment: 0,
        rankReward: 0,
        rewardPayout,
        rewardSplit,
        validatorPayment
      };
    })
  );

  return { nominators, totalStaked, validators };
}

export default function useSortedTargets (): SortedTargets {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS_BASE);
  const electedInfo = useCall<DeriveStakingElected>(api.derive.staking.electedInfo, []);
  const lastEra = useCall<BN>(api.derive.session.indexes, [], {
    transform: ({ activeEra }: DeriveSessionIndexes) => activeEra.gtn(0) ? activeEra.subn(1) : BN_ZERO
  });
  const lastReward = useCall<BN>(lastEra && api.query.staking.erasValidatorReward, [lastEra], {
    transform: (optBalance: Option<Balance>) => optBalance.unwrapOrDefault()
  });
  const [calcWith, setCalcWith] = useState<BN | undefined>(baseBalance());
  const calcWithDebounce = useDebounce(calcWith);
  const [state, setState] = useState<SortedTargets>({ setCalcWith, toggleFavorite });

  useEffect((): void => {
    electedInfo && setState(({ calcWith, setCalcWith, toggleFavorite }) => ({
      ...extractInfo(allAccounts, calcWithDebounce, electedInfo, favorites, lastReward),
      calcWith,
      lastReward,
      setCalcWith,
      toggleFavorite
    }));
  }, [allAccounts, calcWithDebounce, electedInfo, favorites, lastReward]);

  useEffect((): void => {
    calcWith && setState((state) => ({
      ...state,
      calcWith
    }));
  }, [calcWith]);

  return state;
}
