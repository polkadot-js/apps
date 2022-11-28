// Copyright 2017-2022 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { BN } from '@polkadot/util';
import type { Inflation } from './types';

import { useEffect, useState } from 'react';

import { getInflationParams } from '@polkadot/apps-config';
import { BN_MILLION, BN_ZERO } from '@polkadot/util';

import { useApi } from './useApi';
import { useCall } from './useCall';

const EMPTY: Inflation = {inflation: 0, stakedReturn: 0 };

function calcInflation (api: ApiPromise, totalStaked: BN, totalIssuance: BN, numAuctions: BN): Inflation {
  const { stakeTarget, falloff, maxInflation, minInflation, idealStake } = getInflationParams(api);
  const stakedFraction = totalStaked.isZero() || totalIssuance.isZero()
    ? 0
    : totalStaked.mul(BN_MILLION).div(totalIssuance).toNumber() / BN_MILLION.toNumber();
  // Ideal is less based on the actual auctions, see
  // https://github.com/paritytech/polkadot/blob/816cb64ea16102c6c79f6be2a917d832d98df757/runtime/kusama/src/lib.rs#L531
  // const idealStake = stakeTarget - (Math.min(auctionMax, numAuctions.toNumber()) * auctionAdjust);
  const idealInterest = maxInflation / idealStake;
  // inflation calculations, see
  // https://github.com/paritytech/substrate/blob/0ba251c9388452c879bfcca425ada66f1f9bc802/frame/staking/reward-fn/src/lib.rs#L28-L54
  const inflation = 100 * (minInflation + (
    stakedFraction <= stakeTarget
      ? (stakedFraction * (idealInterest - (minInflation / stakeTarget)))
      : (((idealInterest * stakeTarget) - minInflation) * Math.pow(2, (stakeTarget - stakedFraction) / falloff))
  ));

  return {
    // idealInterest,
    // idealStake,
    inflation,
    // stakedFraction,
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
  const totalIssuance = useCall<BN>(api.query.balances?.totalIssuance);
    // Total yearly emission
  const yearly = useCall<BN>(totalIssuance && totalStaked && api.rpc.staking_rewards?.yearlyEmission, [totalStaked?.toString(), totalIssuance?.toString()]);
  const [state, setState] = useState<Inflation>(EMPTY);

  useEffect((): void => {
    yearly && totalIssuance && totalStaked && setState(
      calcDockInflation(api, totalStaked, totalIssuance, yearly)
    );
  }, [api, yearly, totalIssuance, totalStaked]);

  return state;
}
