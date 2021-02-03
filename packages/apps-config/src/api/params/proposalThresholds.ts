// Copyright 2017-2021 @polkadot/app-config authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { KULUPU_GENESIS, KUSAMA_GENESIS, POLKADOT_GENESIS } from '../constants';

export const PROPOSE_THRESHOLDS: Record<string, number> = {
  [KULUPU_GENESIS]: 1,
  [KUSAMA_GENESIS]: 0.5,
  [POLKADOT_GENESIS]: 0.6,
  default: 0.5
};

export const REJECT_THRESHOLDS: Record<string, number> = {
  [KULUPU_GENESIS]: 0.5,
  [KUSAMA_GENESIS]: 0.5,
  [POLKADOT_GENESIS]: 0.5,
  default: 0.5
};

export const SLASH_THRESHOLDS: Record<string, number> = {
  [KUSAMA_GENESIS]: 0.5,
  [POLKADOT_GENESIS]: 0.75,
  default: 0.5
};

export const TREASURY_THRESHOLDS: Record<string, number> = {
  [KULUPU_GENESIS]: 0.5,
  [KUSAMA_GENESIS]: 0.6,
  [POLKADOT_GENESIS]: 0.6,
  default: 0.6
};
