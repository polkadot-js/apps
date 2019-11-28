// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedStakingElected } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/react-components/types';
import { ValidatorPrefs, ValidatorPrefsTo196 } from '@polkadot/types/interfaces';
import { ComponentProps } from '../types';
import { ValidatorInfo } from './types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { InputBalance, Icon, Tooltip } from '@polkadot/react-components';
import { useAccounts, useApi, useFavorites, trackStream } from '@polkadot/react-hooks';

import { STORE_FAVS_BASE } from '../constants';
import translate from '../translate';
import Summary from './Summary';
import Validator from './Validator';

const PERBILL = new BN(1000000000);

interface Props extends I18nProps, ComponentProps {
}

interface AllInfo {
  totalStaked: BN;
  validators: ValidatorInfo[];
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
    .sort((a, b): number =>
      a.rankReward === b.rankReward
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
          : -1
    )
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

function Targets ({ className, sessionRewards, t }: Props): React.ReactElement<Props> {
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const [amount, setAmount] = useState<BN | undefined>(new BN(1000));
  const electedInfo = trackStream<DerivedStakingElected>(api.derive.staking.electedInfo, []);
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS_BASE);
  const [lastReward, setLastReward] = useState(new BN(0));
  const [{ validators, totalStaked }, setWorkable] = useState<AllInfo>({ totalStaked: new BN(0), validators: [] });

  useEffect((): void => {
    if (sessionRewards && sessionRewards.length) {
      setLastReward(sessionRewards[sessionRewards.length - 1].reward);
    }
  }, [sessionRewards]);

  useEffect((): void => {
    if (electedInfo) {
      let totalStaked = new BN(0);
      const numValidators = electedInfo.info.length;
      const validators = sortValidators(
        electedInfo.info.map(({ accountId, stakers, validatorPrefs }): ValidatorInfo => {
          console.error((validatorPrefs as ValidatorPrefs).commission.toString());

          const exposure = stakers || {
            total: api.createType('Compact<Balance>'),
            own: api.createType('Compact<Balance>'),
            others: api.createType('Vec<IndividualExposure>')
          };
          const prefs = (validatorPrefs as (ValidatorPrefs | ValidatorPrefsTo196)) || {
            commission: api.createType('Compact<Perbill>')
          };
          const bondOwn = exposure.own.unwrap();
          const bondTotal = exposure.total.unwrap();
          const perValidatorReward = lastReward.divn(numValidators);
          const validatorPayment = (prefs as ValidatorPrefsTo196).validatorPayment
            ? (prefs as ValidatorPrefsTo196).validatorPayment.unwrap() as BN
            : (prefs as ValidatorPrefs).commission.unwrap().mul(perValidatorReward).div(PERBILL);
          const key = accountId.toString();
          const rewardSplit = perValidatorReward.sub(validatorPayment);
          const calcAmount = amount || new BN(0);
          const rewardPayout = rewardSplit.gtn(0)
            ? calcAmount.mul(rewardSplit).div(calcAmount.add(bondTotal))
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

      setWorkable({ totalStaked, validators });
    }
  }, [allAccounts, amount, electedInfo, favorites, lastReward]);

  return (
    <div className={className}>
      <Summary
        lastReward={lastReward}
        totalStaked={totalStaked}
      />
      {validators.length !== 0 && (
        <>
          <InputBalance
            className='balanceInput'
            help={t('The amount that will be used on a per-validator basis to calculate rewards for that validator.')}
            label={t('amount to use for estimation')}
            onChange={setAmount}
            value={amount}
          />
          <div className='tableContainer'>
            <table>
              <thead>
                <tr className='header'>
                  <th>&nbsp;</th>
                  <th>
                    <Icon
                      name='info circle'
                      data-tip
                      data-for='ranking-trigger'
                    />
                    <Tooltip
                      text={t('Ranking is done of the estimated best return, taking the commission and total bonded amount into account. It does not incorporate validator liveliness according to length of operation nor number of blocks produced.')}
                      trigger='ranking-trigger'
                    />
                  </th>
                  <th className='number'>validator</th>
                  <th className='number'>commission</th>
                  <th className='number'>nominators</th>
                  <th className='number'>total stake</th>
                  <th className='number'>own stake</th>
                  <th className='number'>other stake</th>
                  <th className='number'>payout (est.)</th>
                  <th>&nbsp;</th>
                </tr>
              </thead>
              <tbody>
                {validators.map((info): React.ReactNode =>
                  <Validator
                    info={info}
                    key={info.key}
                    toggleFavorite={toggleFavorite}
                  />
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}

export default translate(
  styled(Targets)`
    text-align: center;

    .balanceInput {
      padding-right: 2rem;
    }

    .tableContainer {
      padding: 1.5rem 0;
    }

    table {
      border-collapse: collapse;
      width: 100%;

      tr {
        border: 1px solid #f2f2f2;
        border-top-width: 0px;

        &:nth-child(even) {
          background: #f2f2f2;
        }

        &:nth-child(odd) {
          background: white;
        }

        &.isNominating {
          background: #ffffed;
        }

        td, th {
          text-align: right;
        }

        td {
          padding: 0.5rem 0.75rem;

          &.number{
            text-align: right;
          }
        }

        th {
          background: #666;
          color: #eee;
          font-family: sans-serif;
          font-weight: normal;
          padding: 0.75rem;
          text-align: right;

          &:first-child {
            border-top-left-radius: 0.25rem;
          }

          &:last-child {
            border-top-right-radius: 0.25rem;
          }
        }
      }
    }

    i.icon {
      cursor: pointer;
    }

    .favorite.isSelected {
      color: darkorange;
    }
  `
);
