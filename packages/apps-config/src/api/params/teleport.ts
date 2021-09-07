// Copyright 2017-2021 @polkadot/app-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';

import { KUSAMA_GENESIS, WESTEND_GENESIS } from '../constants';

// 3 * BaseXcmWeight on Kusama
const KUSAMA_WEIGHT = 3 * 1_000_000_000;

// On Rococo this is lower (3 * 100_000), but non-failing with the higher Kusama weights
const DEFAULT_WEIGHT = KUSAMA_WEIGHT;

const KNOWN_WEIGHTS: Record<string, number> = {
  [KUSAMA_GENESIS]: KUSAMA_WEIGHT,
  [WESTEND_GENESIS]: 3 * 10_000_000
};

export function getTeleportWeight (api: ApiPromise): number {
  return KNOWN_WEIGHTS[api.genesisHash.toHex()] || DEFAULT_WEIGHT;
}
