// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { Inflation } from './types';

import BN from 'bn.js';
import { useEffect, useState } from 'react';

import { getInflationParams } from '@polkadot/apps-config';
import { BN_MILLION } from '@polkadot/util';

import { useApi } from './useApi';
import { useCall } from './useCall';

const EMPTY: Inflation = { inflation: 0, stakedReturn: 0 };

export function calcInflation (api: ApiPromise, totalStaked: BN, totalIssuance: BN): Inflation {
  const { falloff, idealStake, maxInflation, minInflation } = getInflationParams(api);
  const stakedFraction = totalStaked.isZero() || totalIssuance.isZero()
    ? 0
    : totalStaked.mul(BN_MILLION).div(totalIssuance).toNumber() / BN_MILLION.toNumber();
  const idealInterest = maxInflation / idealStake;
  const inflation = 100 * (minInflation + (
    stakedFraction <= idealStake
      ? (stakedFraction * (idealInterest - (minInflation / idealStake)))
      : (((idealInterest * idealStake) - minInflation) * Math.pow(2, (idealStake - stakedFraction) / falloff))
  ));

  return {
    inflation,
    stakedReturn: stakedFraction
      ? (inflation / stakedFraction)
      : 0
  };
}

export function calcDockInflation (api: ApiPromise, totalStaked: BN, totalIssuance: BN, yearlyEmission: BN): Inflation {
  if (totalStaked.isZero() || totalIssuance.isZero()) {
    return { inflation: 0, stakedReturn: 0 };
  }

  const inflation = yearlyEmission.mul(BN_MILLION).div(totalIssuance).toNumber() / BN_MILLION.toNumber();

  // Yearly emission contains share for treasury and validators. Calculate for validators.
  const treasuryPct = api.consts.stakingRewards.treasuryRewardsPct.toNumber();
  const yearlyForValidators = yearlyEmission.muln(100 - treasuryPct).divn(100);

  const stakedReturn = yearlyForValidators.mul(BN_MILLION).div(totalStaked).toNumber() / BN_MILLION.toNumber();

  return {
    inflation: inflation * 100,
    stakedReturn: stakedReturn * 100
  };
}

export function useInflation (totalStaked?: BN): Inflation {
  const { api } = useApi();
  const totalIssuance = useCall<BN>(api.query.balances.totalIssuance);
  const [state, setState] = useState<Inflation>(EMPTY);

  useEffect((): void => {
    totalIssuance && totalStaked && setState(
      calcInflation(api, totalStaked, totalIssuance)
    );
  }, [api, totalIssuance, totalStaked]);

  return state;
}
