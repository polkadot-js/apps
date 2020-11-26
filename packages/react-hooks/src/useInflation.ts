// Copyright 2017-2020 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';
import { useEffect, useState } from 'react';
import { KUSAMA_GENESIS, POLKADOT_GENESIS } from '@polkadot/apps-config';

import { useApi } from './useApi';
import { useCall } from './useCall';

interface Config {
  falloff: number;
  idealStake: number;
  maxInflation: number;
  minInflation: number;
}

interface State {
  inflation: number;
  stakedReturn: number;
}

const DEFAULT_CONFIG: Config = {
  falloff: 0.05,
  idealStake: 0.5,
  maxInflation: 0.1,
  minInflation: 0.025
};

const KNOWN_CONFIG: Record<string, Config> = {
  [KUSAMA_GENESIS]: { ...DEFAULT_CONFIG, idealStake: 0.75 },
  [POLKADOT_GENESIS]: { ...DEFAULT_CONFIG, idealStake: 0.75 }
};

function getInflation ({ falloff, idealStake, maxInflation, minInflation }: Config = DEFAULT_CONFIG, totalStaked: BN, totalIssuance: BN): State {
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

export function useInflation (totalStaked?: BN): State {
  const { api } = useApi();
  const totalIssuance = useCall<BN>(api.query.balances.totalIssuance);
  const [state, setState] = useState<State>({ inflation: 0, stakedReturn: 0 });

  useEffect((): void => {
    totalIssuance && totalStaked && setState(
      getInflation(KNOWN_CONFIG[api.genesisHash.toHex()], totalStaked, totalIssuance)
    );
  }, [api, totalIssuance, totalStaked]);

  return state;
}
