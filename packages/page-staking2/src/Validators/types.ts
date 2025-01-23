// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

export type UsePoints = Record<string, number>;

export interface UseHeartbeat {
  authoredBlocks?: number;
  isOnline?: boolean;
}

export interface UseExposureExposureEntry {
  who: string,
  value: BN
}

export interface UseExposureExposure {
  others: UseExposureExposureEntry[];
  own: BN;
  total: BN;
}

export interface UseExposure {
  clipped?: UseExposureExposure;
  exposure?: UseExposureExposure;
  waiting?: {
    others: UseExposureExposureEntry[];
    total: BN;
  };
}
