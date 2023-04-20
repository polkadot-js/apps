// Copyright 2017-2023 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { BN } from '@polkadot/util';
import type { Inflation } from './types.js';

import { useEffect, useState } from 'react';

import { getInflationParams } from '@polkadot/apps-config';
import { BN_BILLION, BN_MILLION, BN_ZERO } from '@polkadot/util';
import { BN_THOUSAND } from '@polkadot/util/bn/consts';

import { createNamedHook } from './createNamedHook.js';
import { useApi } from './useApi.js';
import { useCall } from './useCall.js';

const EMPTY: Inflation = { idealInterest: 0, idealStake: 0, inflation: 0, stakedFraction: 0, stakedReturn: 0 };

function calcInflationUniformEraPayout (totalIssuance: BN, yearlyInflationInTokens: BN): number {
  const totalIssuanceInTokens = totalIssuance.div(BN_BILLION).div(BN_THOUSAND);

  return (totalIssuanceInTokens.isZero() ? 0.0 : yearlyInflationInTokens.toNumber() / totalIssuanceInTokens.toNumber());
}

function calcInflationRewardCurve (minInflation: number, stakedFraction: number, idealStake: number, idealInterest: number, falloff: number) {
  return (minInflation + (
    stakedFraction <= idealStake
      ? (stakedFraction * (idealInterest - (minInflation / idealStake)))
      : (((idealInterest * idealStake) - minInflation) * Math.pow(2, (idealStake - stakedFraction) / falloff))
  ));
}

function calcInflation (api: ApiPromise, totalStaked: BN, totalIssuance: BN, numAuctions: BN): Inflation {
  const inflationParams = getInflationParams(api);
  const { auctionAdjust, auctionMax, falloff, maxInflation, minInflation, stakeTarget } = inflationParams;
  const stakedFraction = totalStaked.isZero() || totalIssuance.isZero()
    ? 0
    : totalStaked.mul(BN_MILLION).div(totalIssuance).toNumber() / BN_MILLION.toNumber();
  const idealStake = stakeTarget - (Math.min(auctionMax, numAuctions.toNumber()) * auctionAdjust);
  const idealInterest = maxInflation / idealStake;
  let inflationInPercentage = 0;

  if ('yearlyInflationInTokens' in inflationParams) {
    inflationInPercentage = 100 * calcInflationUniformEraPayout(totalIssuance, inflationParams.yearlyInflationInTokens);
  } else {
    inflationInPercentage = 100 * calcInflationRewardCurve(minInflation, stakedFraction, idealStake, idealInterest, falloff);
  }

  let stakedReturn = stakedFraction
    ? (inflationInPercentage / stakedFraction)
    : 0;

  // Here we multiply stakedReturn by 0.9, as in case of Aleph Zero chain 10% of return goes to treasury
  if ('yearlyInflationInTokens' in inflationParams) {
    stakedReturn *= 0.9;
  }

  return {
    idealInterest,
    idealStake,
    inflation: inflationInPercentage,
    stakedFraction,
    stakedReturn
  };
}

function useInflationImpl (totalStaked?: BN): Inflation {
  const { api } = useApi();
  const totalIssuance = useCall<BN>(api.query.balances?.totalIssuance);
  const auctionCounter = useCall<BN>(api.query.auctions?.auctionCounter);
  const [state, setState] = useState<Inflation>(EMPTY);

  useEffect((): void => {
    const numAuctions = api.query.auctions
      ? auctionCounter
      : BN_ZERO;

    numAuctions && totalIssuance && totalStaked && setState(
      calcInflation(api, totalStaked, totalIssuance, numAuctions)
    );
  }, [api, auctionCounter, totalIssuance, totalStaked]);

  return state;
}

export const useInflation = createNamedHook('useInflation', useInflationImpl);
