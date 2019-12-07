// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedStakingElected } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/react-components/types';
import { AccountId, Exposure, ValidatorPrefs, ValidatorPrefsTo196 } from '@polkadot/types/interfaces';
import { SessionRewards } from '../types';
import { ValidatorInfo } from './types';

import BN from 'bn.js';
import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { registry } from '@polkadot/react-api';
import { InputBalance, Table } from '@polkadot/react-components';
import { useAccounts, useApi, useDebounce, useFavorites, useStream } from '@polkadot/react-hooks';
import { createType } from '@polkadot/types';

import { STORE_FAVS_BASE } from '../constants';
import translate from '../translate';
import Summary from './Summary';
import Validator from './Validator';

const PERBILL = new BN(1000000000);

interface Props extends I18nProps {
  sessionRewards: SessionRewards[];
}

interface AllInfo {
  totalStaked: BN;
  validators: ValidatorInfo[];
}

interface BaseInfo {
  accountId: AccountId;
  stakers?: Exposure;
  validatorPrefs?: ValidatorPrefs;
}

function sortValidators (list: ValidatorInfo[]): ValidatorInfo[] {
  return list
    .sort((a, b): number => b.bondTotal.cmp(a.bondTotal))
    .map((info, index): ValidatorInfo => {
      info.rankBonded = index + 1;

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
            ? a.rankBonded === b.rankBonded
              ? 0
              : a.rankBonded < b.rankBonded
                ? 1
                : -1
            : a.rankPayment < b.rankPayment
              ? 1
              : -1
          : a.rankReward < b.rankReward
            ? 1
            : -1;
    })
    .map((info, index): ValidatorInfo => {
      info.rankOverall = index + 1;

      return info;
    })
    .sort((a, b): number =>
      a.isFavorite === b.isFavorite
        ? 0
        : a.isFavorite
          ? -1
          : 1
    );
}

function extractInfo (allAccounts: string[], amount: BN = new BN(0), baseInfo: BaseInfo[], favorites: string[], lastReward: BN): AllInfo {
  let totalStaked = new BN(0);
  const validators = sortValidators(
    baseInfo.map(({ accountId, stakers, validatorPrefs }): ValidatorInfo => {
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
      const perValidatorReward = lastReward.divn(baseInfo.length);
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
        rankBonded: 0,
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

function Targets ({ className, sessionRewards, t }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const [_amount, setAmount] = useState<BN | undefined>(new BN(1000));
  const electedInfo = useStream<DerivedStakingElected>(api.derive.staking.electedInfo, []);
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS_BASE);
  const [lastReward, setLastReward] = useState(new BN(0));
  const lastBase = useRef<number>(0);
  const [baseInfo, setBaseInfo] = useState<BaseInfo[]>([]);
  const [{ validators, totalStaked }, setWorkable] = useState<AllInfo>({ totalStaked: new BN(0), validators: [] });
  const amount = useDebounce(_amount);

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
    if (electedInfo && lastBase.current !== electedInfo.info.length) {
      lastBase.current = electedInfo.info.length;

      setBaseInfo(
        electedInfo.info.map(({ accountId, stakers, validatorPrefs }) => ({
          accountId, stakers, validatorPrefs
        }))
      );
    }
  }, [electedInfo]);

  useEffect((): void => {
    setWorkable(extractInfo(allAccounts, amount, baseInfo, favorites, lastReward));
  }, [allAccounts, amount, baseInfo, favorites, lastReward]);

  return (
    <div className={className}>
      <Summary
        lastReward={lastReward}
        totalStaked={totalStaked}
      />
      {validators.length
        ? (
          <>
            <InputBalance
              className='balanceInput'
              help={t('The amount that will be used on a per-validator basis to calculate rewards for that validator.')}
              label={t('amount to use for estimation')}
              onChange={setAmount}
              value={_amount}
            />
            <Table>
              <Table.Body>
                {validators.map((info): React.ReactNode =>
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

export default translate(
  styled(Targets)`
    text-align: center;

    .balanceInput {
      padding-right: 2rem;
      margin-bottom: 1.5rem;
    }
  `
);
