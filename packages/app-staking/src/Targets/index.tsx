// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedStakingElected } from '@polkadot/api-derive/types';
import { ValidatorPrefs, ValidatorPrefsTo196 } from '@polkadot/types/interfaces';
import { SessionRewards } from '../types';
import { ValidatorInfo } from './types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { registry } from '@polkadot/react-api';
import { Icon, InputBalance, Table } from '@polkadot/react-components';
import { useAccounts, useApi, useDebounce, useFavorites, useCall } from '@polkadot/react-hooks';
import { createType } from '@polkadot/types';

import { STORE_FAVS_BASE } from '../constants';
import { useTranslation } from '../translate';
import Summary from './Summary';
import Validator from './Validator';

const PERBILL = new BN(1000000000);

interface Props {
  className?: string;
  sessionRewards: SessionRewards[];
}

interface AllInfo {
  totalStaked: BN;
  validators: ValidatorInfo[];
}

type SortBy = 'rankOverall' | 'rankBondOwn' | 'rankBondOther' | 'rankBondTotal' | 'rankComm';

function sortValidators (list: ValidatorInfo[]): ValidatorInfo[] {
  return list
    .sort((a, b): number => b.commissionPer - a.commissionPer)
    .map((info, index): ValidatorInfo => {
      info.rankComm = index + 1;

      return info;
    })
    .sort((a, b): number => b.bondOther.cmp(a.bondOther))
    .map((info, index): ValidatorInfo => {
      info.rankBondOther = index + 1;

      return info;
    })
    .sort((a, b): number => b.bondOwn.cmp(a.bondOwn))
    .map((info, index): ValidatorInfo => {
      info.rankBondOwn = index + 1;

      return info;
    })
    .sort((a, b): number => b.bondTotal.cmp(a.bondTotal))
    .map((info, index): ValidatorInfo => {
      info.rankBondTotal = index + 1;

      return info;
    })
    .sort((a, b): number => b.validatorPayment.cmp(a.validatorPayment))
    .map((info, index): ValidatorInfo => {
      info.rankPayment = index + 1;

      return info;
    })
    .sort((a, b): number => a.rewardSplit.cmp(b.rewardSplit))
    .map((info, index): ValidatorInfo => {
      info.rankReward = index + 1;

      return info;
    })
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
    .map((info, index): ValidatorInfo => {
      info.rankOverall = index + 1;

      return info;
    });
}

function extractInfo (allAccounts: string[], amount: BN = new BN(0), electedInfo: DerivedStakingElected, favorites: string[], lastReward: BN): AllInfo {
  let totalStaked = new BN(0);
  const perValidatorReward = lastReward.divn(electedInfo.info.length);
  const validators = sortValidators(
    electedInfo.info.map(({ accountId, stakers, validatorPrefs }): ValidatorInfo => {
      const exposure = stakers || {
        total: createType(registry, 'Compact<Balance>'),
        own: createType(registry, 'Compact<Balance>'),
        others: createType(registry, 'Vec<IndividualExposure>')
      };
      const prefs = (validatorPrefs as (ValidatorPrefs | ValidatorPrefsTo196)) || {
        commission: createType(registry, 'Compact<Perbill>')
      };
      const bondOwn = exposure.own.unwrap();
      const bondTotal = exposure.total.unwrap();
      const validatorPayment = (prefs as ValidatorPrefsTo196).validatorPayment
        ? (prefs as ValidatorPrefsTo196).validatorPayment.unwrap() as BN
        : (prefs as ValidatorPrefs).commission.unwrap().mul(perValidatorReward).div(PERBILL);
      const key = accountId.toString();
      const rewardSplit = perValidatorReward.sub(validatorPayment);
      const rewardPayout = rewardSplit.gtn(0)
        ? amount.mul(rewardSplit).div(amount.add(bondTotal))
        : new BN(0);
      const isNominating = exposure.others.reduce((isNominating, indv): boolean => {
        return isNominating || allAccounts.includes(indv.who.toString());
      }, allAccounts.includes(key));

      totalStaked = totalStaked.add(bondTotal);

      return {
        accountId,
        bondOther: bondTotal.sub(bondOwn),
        bondOwn,
        bondShare: 0,
        bondTotal,
        isCommission: !!(prefs as ValidatorPrefs).commission,
        isFavorite: favorites.includes(key),
        isNominating,
        key,
        commissionPer: (((prefs as ValidatorPrefs).commission?.unwrap() || new BN(0)).muln(10000).div(PERBILL).toNumber() / 100),
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

  return { totalStaked, validators };
}

function Targets ({ className, sessionRewards }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const [_amount, setAmount] = useState<BN | undefined>(new BN(1000));
  const electedInfo = useCall<DerivedStakingElected>(api.derive.staking.electedInfo, []);
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS_BASE);
  const [lastReward, setLastReward] = useState(new BN(0));
  const [{ validators, totalStaked }, setWorkable] = useState<AllInfo>({ totalStaked: new BN(0), validators: [] });
  const [{ sorted, sortBy, sortFromMax }, setSorted] = useState<{ sorted: ValidatorInfo[]; sortBy: SortBy; sortFromMax: boolean }>({ sorted: [], sortBy: 'rankOverall', sortFromMax: true });
  const amount = useDebounce(_amount);

  const _sort = (newSortBy: SortBy, unsorted = validators, isAdjust = true): void => {
    const newSortFromMax = isAdjust && newSortBy === sortBy ? !sortFromMax : true;

    setSorted({
      sortBy: newSortBy,
      sortFromMax: newSortFromMax,
      sorted: unsorted
        .sort((a, b): number =>
          newSortFromMax
            ? a[newSortBy] - b[newSortBy]
            : b[newSortBy] - a[newSortBy]
        )
        .sort((a, b): number =>
          a.isFavorite === b.isFavorite
            ? 0
            : a.isFavorite
              ? -1
              : 1
        )
    });
  };

  useEffect((): void => {
    if (sessionRewards && sessionRewards.length) {
      const lastRewardSession = sessionRewards.filter(({ reward }): boolean => reward.gtn(0));

      setLastReward(
        lastRewardSession.length
          ? lastRewardSession[lastRewardSession.length - 1].reward
          : new BN(0)
      );
    }
  }, [sessionRewards]);

  useEffect((): void => {
    if (electedInfo) {
      const { totalStaked, validators } = extractInfo(allAccounts, amount, electedInfo, favorites, lastReward);

      setWorkable({ totalStaked, validators });
      _sort('rankOverall', validators, false);
    }
  }, [allAccounts, amount, electedInfo, favorites, lastReward]);

  return (
    <div className={className}>
      <Summary
        lastReward={lastReward}
        totalStaked={totalStaked}
      />
      {sorted.length
        ? (
          <>
            <InputBalance
              className='balanceInput'
              help={t('The amount that will be used on a per-validator basis to calculate rewards for that validator.')}
              isFull
              label={t('amount to use for estimation')}
              onChange={setAmount}
              value={_amount}
            />
            <Table>
              <Table.Head>
                <th>&nbsp;</th>
                <th>&nbsp;</th>
                <th>&nbsp;</th>
                {['rankComm', 'rankBondTotal', 'rankBondOwn', 'rankBondOther', 'rankOverall'].map((header): React.ReactNode => (
                  <th
                    className={`isClickable ${sortBy === header && 'isSelected'}`}
                    key={header}
                    onClick={(): void => _sort(header as 'rankComm')}
                  ><Icon name={sortBy === header ? (sortFromMax ? 'chevron down' : 'chevron up') : 'minus'} /></th>
                ))}
                <th>&nbsp;</th>
              </Table.Head>
              <Table.Body>
                {sorted.map((info): React.ReactNode =>
                  <Validator
                    info={info}
                    key={info.key}
                    toggleFavorite={toggleFavorite}
                  />
                )}
              </Table.Body>
            </Table>
          </>
        )
        : (
          <div className='tableContainer'>
            {t('Validator info not available')}
          </div>
        )
      }
    </div>
  );
}

export default styled(Targets)`
  text-align: center;
`;
