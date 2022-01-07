// Copyright 2017-2022 @polkadot/apps-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';

import { KULUPU_GENESIS, KUSAMA_GENESIS, POLKADOT_GENESIS } from '../constants';

// normal fast-track proposals
const FAST_TRACK: Record<string, number> = {
  default: 2 / 3
};

// in the case where block < fastTrackVotingPeriod
const FAST_TRACK_NO_DELAY: Record<string, number> = {
  default: 1
};

const PROPOSE: Record<string, number> = {
  [KULUPU_GENESIS]: 1,
  [KUSAMA_GENESIS]: 1 / 2,
  [POLKADOT_GENESIS]: 3 / 5,
  default: 1 / 2
};

const SLASH: Record<string, number> = {
  [KUSAMA_GENESIS]: 1 / 2,
  [POLKADOT_GENESIS]: 3 / 4,
  default: 1 / 2
};

const TREASURY: Record<string, number> = {
  [KULUPU_GENESIS]: 1 / 2,
  [KUSAMA_GENESIS]: 3 / 5,
  [POLKADOT_GENESIS]: 3 / 5,
  default: 3 / 5
};

export function getFastTrackThreshold (api: ApiPromise, isDefault: boolean): number {
  return isDefault
    ? (FAST_TRACK[api.genesisHash.toHex()] || FAST_TRACK.default)
    : (FAST_TRACK_NO_DELAY[api.genesisHash.toHex()] || FAST_TRACK_NO_DELAY.default);
}

export function getProposalThreshold (api: ApiPromise): number {
  return PROPOSE[api.genesisHash.toHex()] || PROPOSE.default;
}

export function getSlashProposalThreshold (api: ApiPromise): number {
  return SLASH[api.genesisHash.toHex()] || SLASH.default;
}

export function getTreasuryProposalThreshold (api: ApiPromise): number {
  return TREASURY[api.genesisHash.toHex()] || TREASURY.default;
}
