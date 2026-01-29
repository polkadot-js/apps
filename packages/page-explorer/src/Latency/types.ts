// Copyright 2017-2025 @polkadot/app-explorer authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Hash } from '@polkadot/types/interfaces';

export interface Detail {
  block: {
    bytes: number;
    number: number;
  };
  delay: number;
  events: {
    count: number;
    system: number;
  };
  extrinsics: {
    bytes: number;
    count: number;
  };
  now: number;
  parentHash: Hash;
}

export interface Result {
  details: Detail[];
  isLoaded: boolean;
  maxItems: number;
  stdDev: number;
  timeAvg: number;
  timeMax: number;
  timeMin: number;
}

export interface ChartContents {
  labels: string[];
  values: number[][];
}
