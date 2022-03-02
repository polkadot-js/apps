// Copyright 2017-2022 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { BN } from '@polkadot/util';
import type { Inflation } from './types';

import { useEffect, useState } from 'react';

import {getInflationParams, UniformEraPayoutInflationParams} from '@polkadot/apps-config';
import {BN_BILLION, BN_MILLION, BN_ZERO} from '@polkadot/util';

import { createNamedHook } from './createNamedHook';
import { useApi } from './useApi';
import { useCall } from './useCall';
import {BN_THOUSAND} from "@polkadot/util/bn/consts";

const EMPTY: Inflation = { idealInterest: 0, idealStake: 0, inflation: 0, stakedFraction: 0, stakedReturn: 0 };

function calcInflationUniformEraPayout(totalIssuance: BN, inflation_params: UniformEraPayoutInflationParams) : number {
  const totalIssuanceInTokens = totalIssuance.div(BN_BILLION).div(BN_THOUSAND);
  return (totalIssuanceInTokens.isZero() ? 0.0 : inflation_params.yearlyInflationInTokens.toNumber() / totalIssuanceInTokens.toNumber());
}

function calcInflation (api: ApiPromise, totalStaked: BN, totalIssuance: BN, numAuctions: BN): Inflation {
  const inflation_params = getInflationParams(api);
  const {auctionAdjust, auctionMax, falloff, maxInflation, minInflation, stakeTarget} = inflation_params;
  const stakedFraction = totalStaked.isZero() || totalIssuance.isZero()
    ? 0
    : totalStaked.mul(BN_MILLION).div(totalIssuance).toNumber() / BN_MILLION.toNumber();
  const idealStake = stakeTarget - (Math.min(auctionMax, numAuctions.toNumber()) * auctionAdjust);
  const idealInterest = maxInflation / idealStake;
  let inflationInPercentage = 0;
  if ('yearlyInflationInTokens' in inflation_params) {
    inflationInPercentage = 100 * calcInflationUniformEraPayout(totalIssuance, inflation_params as UniformEraPayoutInflationParams);
  } else {
    inflationInPercentage = 100 * (minInflation + (
      stakedFraction <= idealStake
        ? (stakedFraction * (idealInterest - (minInflation / idealStake)))
        : (((idealInterest * idealStake) - minInflation) * Math.pow(2, (idealStake - stakedFraction) / falloff))
     ));
  }

  return {
    idealInterest,
    idealStake,
    inflation: inflationInPercentage,
    stakedFraction,
    stakedReturn: stakedFraction
      ? (inflationInPercentage / stakedFraction)
      : 0
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
