// Copyright 2017-2020 @polkadot/app-council authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ApiPromise } from '@polkadot/api';

const PROPOSE_THRESHOLDS: Record<string, number> = {
  // Polkadot
  '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3': 0.6
};

const SLASH_THRESHOLDS: Record<string, number> = {
  // Polkadot
  '0x91b171bb158e2d3848fa23a9f1c25182fb8e20313b2c1eb49219da7a70ce90c3': 0.75
};

export function getThreshold (api: ApiPromise): number {
  return PROPOSE_THRESHOLDS[api.genesisHash.toHex()] || 0.5;
}

export function getSlashThreshold (api: ApiPromise): number {
  return SLASH_THRESHOLDS[api.genesisHash.toHex()] || 0.5;
}
