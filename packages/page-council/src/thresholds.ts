// Copyright 2017-2020 @polkadot/app-council authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ApiPromise } from '@polkadot/api';
import { POLKADOT_GENESIS, KULUPU_GENESIS, KUSAMA_GENESIS } from '@polkadot/apps-config/api/constants';

const PROPOSE_THRESHOLDS: Record<string, number> = {
  [KULUPU_GENESIS]: 1,
  [KUSAMA_GENESIS]: 0.5,
  [POLKADOT_GENESIS]: 0.6,
  default: 0.5
};

const SLASH_THRESHOLDS: Record<string, number> = {
  [KUSAMA_GENESIS]: 0.5,
  [POLKADOT_GENESIS]: 0.75,
  default: 0.5
};

const TREASURY_THRESHOLDS: Record<string, number> = {
  [KULUPU_GENESIS]: 0.5,
  [KUSAMA_GENESIS]: 0.6,
  [POLKADOT_GENESIS]: 0.6,
  default: 0.6
};

export function getThreshold (api: ApiPromise): number {
  return PROPOSE_THRESHOLDS[api.genesisHash.toHex()] || PROPOSE_THRESHOLDS.default;
}

export function getSlashThreshold (api: ApiPromise): number {
  return SLASH_THRESHOLDS[api.genesisHash.toHex()] || SLASH_THRESHOLDS.default;
}

export function getTreasuryThreshold (api: ApiPromise): number {
  return TREASURY_THRESHOLDS[api.genesisHash.toHex()] || TREASURY_THRESHOLDS.default;
}
