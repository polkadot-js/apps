// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveStakingElected, DeriveSessionIndexes } from '@polkadot/api-derive/types';
import { Balance, ValidatorPrefs, ValidatorPrefsTo196 } from '@polkadot/types/interfaces';
import { ValidatorInfo } from './types';

import BN from 'bn.js';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { registry } from '@polkadot/react-api';
import { Icon, InputBalance, Table } from '@polkadot/react-components';
import { useAccounts, useApi, useCall, useDebounce, useFavorites } from '@polkadot/react-hooks';
import { createType, Option } from '@polkadot/types';

import { STORE_FAVS_BASE } from '../constants';
import { useTranslation } from '../translate';
import Summary from './Summary';
import Validator from './Validator';

interface Props {
  className?: string;
}

interface AllInfo {
  nominators: string[];
  sorted?: ValidatorInfo[];
  totalStaked?: BN;
  validators: ValidatorInfo[];
}

type SortBy = 'rankOverall' | 'rankBondOwn' | 'rankBondOther' | 'rankBondTotal' | 'rankComm';

const PERBILL = new BN(1_000_000_000);

function sortValidators (list: ValidatorInfo[]): ValidatorInfo[] {
  return list
    .filter((a) => a.bondTotal.gtn(0))
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

function extractInfo (allAccounts: string[], amount: BN = new BN(0), electedInfo: DeriveStakingElected, favorites: string[], lastReward = new BN(1)): AllInfo {
  const nominators: string[] = [];
  let totalStaked = new BN(0);
  const perValidatorReward = lastReward.divn(electedInfo.info.length);
  const validators = sortValidators(
    electedInfo.info.map(({ accountId, exposure: _exposure, validatorPrefs }): ValidatorInfo => {
      const exposure = _exposure || {
        others: createType(registry, 'Vec<IndividualExposure>'),
        own: createType(registry, 'Compact<Balance>'),
        total: createType(registry, 'Compact<Balance>')
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
        commissionPer: (((prefs as ValidatorPrefs).commission?.unwrap() || new BN(0)).toNumber() / 10_000_000),
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

function sort (sortBy: SortBy, sortFromMax: boolean, validators: ValidatorInfo[]): ValidatorInfo[] {
  return validators
    .sort((a, b): number => sortFromMax
      ? a[sortBy] - b[sortBy]
      : b[sortBy] - a[sortBy]
    )
    .sort((a, b): number => a.isFavorite === b.isFavorite
      ? 0
      : (a.isFavorite ? -1 : 1)
    );
}

function Targets ({ className }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const lastEra = useCall<BN>(api.derive.session.indexes, [], {
    defaultValue: new BN(0),
    transform: ({ activeEra }: DeriveSessionIndexes) => activeEra.gtn(0) ? activeEra.subn(1) : new BN(0)
  }) || new BN(0);
  const lastReward = useCall<BN>(api.query.staking.erasValidatorReward, [lastEra], {
    transform: (optBalance: Option<Balance>) => optBalance.unwrapOrDefault()
  });
  const [_amount, setAmount] = useState<BN | undefined>(new BN(1_000));
  const electedInfo = useCall<DeriveStakingElected>(api.derive.staking.electedInfo, []);
  const [favorites, toggleFavorite] = useFavorites(STORE_FAVS_BASE);
  const [{ nominators, sorted, totalStaked, validators }, setWorkable] = useState<AllInfo>({ nominators: [], validators: [] });
  const [{ sortBy, sortFromMax }, setSortBy] = useState<{ sortBy: SortBy; sortFromMax: boolean }>({ sortBy: 'rankOverall', sortFromMax: true });
  const amount = useDebounce(_amount);
  const labels = useMemo(
    (): Record<string, string> => ({ rankBondOther: t('other stake'), rankBondOwn: t('own stake'), rankBondTotal: t('total stake'), rankComm: t('commission'), rankOverall: t('profit/era est') }),
    [t]
  );

  const _sort = useCallback(
    (newSortBy: SortBy): void =>
      setSortBy(({ sortBy, sortFromMax }) => ({
        sortBy: newSortBy,
        sortFromMax: newSortBy === sortBy
          ? !sortFromMax
          : true
      })),
    []
  );

  useEffect((): void => {
    if (electedInfo) {
      const { nominators, totalStaked, validators } = extractInfo(allAccounts, amount, electedInfo, favorites, lastReward);
      const sorted = sort(sortBy, sortFromMax, validators);

      setWorkable({ nominators, sorted, totalStaked, validators });
    }
  }, [allAccounts, amount, electedInfo, favorites, lastReward, sortBy, sortFromMax]);

  return (
    <div className={className}>
      <Summary
        lastReward={lastReward}
        numNominators={nominators.length}
        numValidators={validators.length}
        totalStaked={totalStaked}
      />
      <Table
        empty={sorted && t('No active validators to check for rewards available')}
        filter={
          <InputBalance
            className='balanceInput'
            help={t('The amount that will be used on a per-validator basis to calculate rewards for that validator.')}
            isFull
            label={t('amount to use for estimation')}
            onChange={setAmount}
            value={_amount}
          />
        }
        header={[
          [t('validators'), 'start', 3],
          ...['rankComm', 'rankBondTotal', 'rankBondOwn', 'rankBondOther', 'rankOverall'].map((header) => [
            <>{labels[header]}<Icon name={sortBy === header ? (sortFromMax ? 'chevron down' : 'chevron up') : 'minus'} /></>,
            `isClickable ${sortBy === header && 'ui--highlight--border'} number`,
            1,
            (): void => _sort(header as 'rankComm')
          ]),
          []
        ]}
      >
        {sorted?.map((info): React.ReactNode =>
          <Validator
            info={info}
            key={info.key}
            toggleFavorite={toggleFavorite}
          />
        )}
      </Table>
    </div>
  );
}

export default React.memo(styled(Targets)`
  text-align: center;

  th {
    i.icon {
      margin-left: 0.5rem;
    }
  }
`);
