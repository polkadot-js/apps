// Copyright 2017-2023 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

export interface CacheValue<T> {
  check: BN;
  value?: T;
}

export interface SessionInfo {
  activeEra?: BN | null;
  currentEra?: BN | null;
  currentSession?: BN | null;
}

export interface Validator {
  isElected: boolean;
  isFavorite: boolean;
  isOwned: boolean;
  key: string;
  stashId: string;
  stashIndex: number;
}
