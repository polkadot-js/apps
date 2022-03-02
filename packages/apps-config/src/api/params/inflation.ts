// Copyright 2017-2022 @polkadot/app-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import {BN, BN_MILLION} from "@polkadot/util";

import {
  ALEPHZERO_MAINNET_GENESIS, ALEPHZERO_TESTNET_GENESIS,
  DOCK_POS_TESTNET_GENESIS,
  KUSAMA_GENESIS,
  NEATCOIN_GENESIS,
  NFTMART_GENESIS,
  POLKADOT_GENESIS
} from '../constants';

export interface InflationParams {
  auctionAdjust: number;
  auctionMax: number;
  falloff: number;
  maxInflation: number;
  minInflation: number;
  stakeTarget: number;
}

export interface UniformEraPayoutInflationParams extends InflationParams {
  yearlyInflationInTokens: BN;
}

const DEFAULT_PARAMS: InflationParams = {
  auctionAdjust: 0,
  auctionMax: 0,
  falloff: 0.05,
  maxInflation: 0.1,
  minInflation: 0.025,
  stakeTarget: 0.5
};

const DEFAULT_UNIFORM_ERA_PAYOUT_PARAMS: UniformEraPayoutInflationParams = {
  ...DEFAULT_PARAMS,
  yearlyInflationInTokens: BN_MILLION.mul(new BN(30)),
};

const KNOWN_PARAMS: Record<string, InflationParams> = {
  [DOCK_POS_TESTNET_GENESIS]: { ...DEFAULT_PARAMS, stakeTarget: 0.75 },
  [KUSAMA_GENESIS]: { ...DEFAULT_PARAMS, auctionAdjust: (0.3 / 60), auctionMax: 60, stakeTarget: 0.75 },
  [NEATCOIN_GENESIS]: { ...DEFAULT_PARAMS, stakeTarget: 0.75 },
  [NFTMART_GENESIS]: { ...DEFAULT_PARAMS, falloff: 0.04, stakeTarget: 0.60 },
  [POLKADOT_GENESIS]: { ...DEFAULT_PARAMS, stakeTarget: 0.75 },
  [ALEPHZERO_MAINNET_GENESIS]: DEFAULT_UNIFORM_ERA_PAYOUT_PARAMS,
  [ALEPHZERO_TESTNET_GENESIS]: DEFAULT_UNIFORM_ERA_PAYOUT_PARAMS,
};

export function getInflationParams (api: ApiPromise): InflationParams {
  // below behaviour is different between our fork and upstream, that by default we are operating
  // in uniform era payout model, rather than Polkadot-js's RewardCurve model
  return KNOWN_PARAMS[api.genesisHash.toHex()] || DEFAULT_UNIFORM_ERA_PAYOUT_PARAMS;
}
