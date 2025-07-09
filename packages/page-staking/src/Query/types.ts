// Copyright 2017-2025 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';

export interface Props {
  className?: string;
  labels: string[];
  validatorId: string;
}

export type LineDataEntry = (BN | number)[];

export type LineData = LineDataEntry[];

export interface ChartInfo {
  labels: string[];
  values: LineData;
}
