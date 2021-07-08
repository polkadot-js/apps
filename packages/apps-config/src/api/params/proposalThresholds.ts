// Copyright 2017-2021 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';

import { KULUPU_GENESIS, KUSAMA_GENESIS, POLKADOT_GENESIS } from '../constants';

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

export function getProposalThreshold (api: ApiPromise): number {
  return PROPOSE_THRESHOLDS[api.genesisHash.toHex()] || PROPOSE_THRESHOLDS.default;
}

export function getSlashProposalThreshold (api: ApiPromise): number {
  return SLASH_THRESHOLDS[api.genesisHash.toHex()] || SLASH_THRESHOLDS.default;
}

export function getTreasuryProposalThreshold (api: ApiPromise): number {
  return TREASURY_THRESHOLDS[api.genesisHash.toHex()] || TREASURY_THRESHOLDS.default;
}
