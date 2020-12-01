// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { useEffect, useState } from 'react';

import type { ApiPromise } from '@polkadot/api';
import { getInflationParams } from '@polkadot/apps-config';

import type { Inflation } from './types';
import { useApi } from './useApi';
import { useCall } from './useCall';

export function calcInflation (api: ApiPromise, totalStaked: BN, totalIssuance: BN): Inflation {
  const { falloff, idealStake, maxInflation, minInflation } = getInflationParams(api);
  const stakedFraction = totalStaked.muln(1_000_000).div(totalIssuance).toNumber() / 1_000_000;
  const idealInterest = maxInflation / idealStake;
  const inflation = 100 * (minInflation + (
    stakedFraction <= idealStake
      ? (stakedFraction * (idealInterest - (minInflation / idealStake)))
      : (((idealInterest * idealStake) - minInflation) * Math.pow(2, (idealStake - stakedFraction) / falloff))
  ));

  return {
    inflation,
    stakedReturn: inflation / stakedFraction
  };
}

export function useInflation (totalStaked?: BN): Inflation {
  const { api } = useApi();
  const totalIssuance = useCall<BN>(api.query.balances.totalIssuance);
  const [state, setState] = useState<Inflation>({ inflation: 0, stakedReturn: 0 });

  useEffect((): void => {
    totalIssuance && totalStaked && setState(
      calcInflation(api, totalStaked, totalIssuance)
    );
  }, [api, totalIssuance, totalStaked]);

  return state;
}
