// Copyright 2017-2022 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { ParaId } from '@polkadot/types/interfaces';
import type { Inflation } from './types';

import { useEffect, useState } from 'react';

import { getInflationParams } from '@polkadot/apps-config';
import { BN, BN_MILLION, BN_ZERO } from '@polkadot/util';

import { createNamedHook } from './createNamedHook';
import { useApi } from './useApi';
import { useCall } from './useCall';

const EMPTY: Inflation = { idealInterest: 0, idealStake: 0, inflation: 0, stakedFraction: 0, stakedReturn: 0 };

function calcInflation (api: ApiPromise, totalStaked: BN, totalIssuance: BN, numParas: BN): Inflation {
  const { auctionAdjust, auctionMax, falloff, maxInflation, minInflation, stakeTarget } = getInflationParams(api);
  const stakedFraction = totalStaked.isZero() || totalIssuance.isZero()
    ? 0
    : totalStaked.mul(BN_MILLION).div(totalIssuance).toNumber() / BN_MILLION.toNumber();
  // Ideal is less based on the actual auctions, see
  // https://github.com/paritytech/polkadot/blob/816cb64ea16102c6c79f6be2a917d832d98df757/runtime/kusama/src/lib.rs#L531
  const idealStake = stakeTarget - (Math.min(auctionMax, numParas.toNumber()) * auctionAdjust);
  const idealInterest = maxInflation / idealStake;
  // inflation calculations, see
  // https://github.com/paritytech/substrate/blob/0ba251c9388452c879bfcca425ada66f1f9bc802/frame/staking/reward-fn/src/lib.rs#L28-L54
  const inflation = 100 * (minInflation + (
    stakedFraction <= idealStake
      ? (stakedFraction * (idealInterest - (minInflation / idealStake)))
      : (((idealInterest * idealStake) - minInflation) * Math.pow(2, (idealStake - stakedFraction) / falloff))
  ));

  return {
    idealInterest,
    idealStake,
    inflation,
    stakedFraction,
    stakedReturn: stakedFraction
      ? (inflation / stakedFraction)
      : 0
  };
}

function useInflationImpl (totalStaked?: BN): Inflation {
  const { api } = useApi();
  const totalIssuance = useCall<BN>(api.query.balances?.totalIssuance);
  const paraIds = useCall<ParaId[]>(api.query.paras?.parachains);
  const [state, setState] = useState<Inflation>(EMPTY);

  useEffect((): void => {
    // Current generation uses the number of public paras (previously auction counter),
    // i.e. all those that are non-common and non-system chains as indicate by >= 2000
    // as the paraId are counted
    // https://github.com/paritytech/polkadot/blob/3cf644abad63c4a177f0697683b72a64c4706852/runtime/kusama/src/lib.rs#L521-L546
    const numParas = api.query.paras
      ? paraIds && new BN(paraIds.filter((id) => id.gten(2_000)).length)
      : BN_ZERO;

    numParas && totalIssuance && totalStaked && setState(
      calcInflation(api, totalStaked, totalIssuance, numParas)
    );
  }, [api, paraIds, totalIssuance, totalStaked]);

  return state;
}

export const useInflation = createNamedHook('useInflation', useInflationImpl);
