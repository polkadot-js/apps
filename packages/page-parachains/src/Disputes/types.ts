// Copyright 2017-2023 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { u32 } from '@polkadot/types';

export interface SessionInfo {
  paraValidators: string[];
  sessionIndex: u32;
  sessionValidators: string[];
}

export interface DisputeInfo {
  disputes?: Record<string, string[]>;
  sessionInfo: SessionInfo;
}
