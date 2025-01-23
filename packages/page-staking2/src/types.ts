// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

export interface SessionInfo {
  activeEra?: BN | null;
  currentEra?: BN | null;
  currentSession?: BN | null;
}

export interface Validator {
  isElected: boolean;
  isFavorite: boolean;
  isOwned: boolean;
  isPara?: boolean;
  key: string;
  stashId: string;
  stashIndex: number;
}
