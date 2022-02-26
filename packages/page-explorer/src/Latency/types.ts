// Copyright 2017-2022 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Hash } from '@polkadot/types/interfaces';

export interface Detail {
  blockNumber: number;
  countEvents: number;
  countExtrinsics: number;
  delay: number;
  now: number;
  parentHash: Hash;
}

export interface Result {
  details: Detail[];
  stdDev: number;
  timeAvg: number;
  timeMax: number;
  timeMin: number;
}
