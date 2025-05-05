// Copyright 2017-2025 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';

import { CERE_NETWORK_GENESIS, CERE_NETWORK_TESTNET_GENESIS, DOCK_POS_TESTNET_GENESIS, JOYSTREAM_GENESIS, KUSAMA_GENESIS, NEATCOIN_GENESIS, NFTMART_GENESIS, POLKADOT_GENESIS, VARA_NETWORK_GENESIS, VARA_NETWORK_TESTNET_GENESIS, ZKVERIFY_VOLTA_GENESIS } from '../constants.js';

interface InflationParams {
  auctionAdjust: number;
  auctionMax: number;
  falloff: number;
  maxInflation: number;
  minInflation: number;
  stakeTarget: number;
}

const DEFAULT_PARAMS: InflationParams = {
  auctionAdjust: 0,
  auctionMax: 0,
  // 5% for falloff, as per the defaults, see
  // https://github.com/paritytech/polkadot/blob/816cb64ea16102c6c79f6be2a917d832d98df757/runtime/kusama/src/lib.rs#L534
  falloff: 0.05,
  // 10% max, 0.25% min, see
  // https://github.com/paritytech/polkadot/blob/816cb64ea16102c6c79f6be2a917d832d98df757/runtime/kusama/src/lib.rs#L523
  maxInflation: 0.1,
  minInflation: 0.025,
  stakeTarget: 0.5
};

const CERE_NETWORK_INFLATION_PARAMS = { ...DEFAULT_PARAMS, maxInflation: 0.05, minInflation: 0.0001, stakeTarget: 0.2 };

const VARA_NETWORK_INFLATION_PARAMS = { ...DEFAULT_PARAMS, maxInflation: 0, minInflation: 0.0001, stakeTarget: 0.85 };

const JOYSTREAM_INFLATION_PARAMS = { ...DEFAULT_PARAMS, maxInflation: 0.03, minInflation: 0.0075 };

const ZKVERIFY_VOLTA_INFLATION_PARAMS = { ...DEFAULT_PARAMS, auctionAdjust: 0, maxInflation: 0.025, minInflation: 0.025, stakeTarget: 0 };

const KNOWN_PARAMS: Record<string, InflationParams> = {
  [CERE_NETWORK_GENESIS]: CERE_NETWORK_INFLATION_PARAMS,
  [CERE_NETWORK_TESTNET_GENESIS]: CERE_NETWORK_INFLATION_PARAMS,
  [DOCK_POS_TESTNET_GENESIS]: { ...DEFAULT_PARAMS, stakeTarget: 0.75 },
  [JOYSTREAM_GENESIS]: JOYSTREAM_INFLATION_PARAMS,
  // 30% for up to 60 slots, see
  // https://github.com/paritytech/polkadot/blob/816cb64ea16102c6c79f6be2a917d832d98df757/runtime/kusama/src/lib.rs#L526-L527
  // 75% ideal target, see
  // https://github.com/paritytech/polkadot/blob/816cb64ea16102c6c79f6be2a917d832d98df757/runtime/kusama/src/lib.rs#L529-L531
  [KUSAMA_GENESIS]: { ...DEFAULT_PARAMS, auctionAdjust: (0.3 / 60), auctionMax: 60, stakeTarget: 0.75 },
  [NEATCOIN_GENESIS]: { ...DEFAULT_PARAMS, stakeTarget: 0.75 },
  [NFTMART_GENESIS]: { ...DEFAULT_PARAMS, falloff: 0.04, stakeTarget: 0.60 },
  [POLKADOT_GENESIS]: { ...DEFAULT_PARAMS, stakeTarget: 0.75 },
  [VARA_NETWORK_GENESIS]: VARA_NETWORK_INFLATION_PARAMS,
  [VARA_NETWORK_TESTNET_GENESIS]: VARA_NETWORK_INFLATION_PARAMS,
  [ZKVERIFY_VOLTA_GENESIS]: ZKVERIFY_VOLTA_INFLATION_PARAMS
};

export function getInflationParams (api: ApiPromise): InflationParams {
  return KNOWN_PARAMS[api.genesisHash.toHex()] || DEFAULT_PARAMS;
}
