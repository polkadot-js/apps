// Copyright 2017-2021 @polkadot/app-staking authors & contributors
// SPDX-License-Identifier: Apache-2.0

import BN from 'bn.js';

export interface Props {
  className?: string;
  validatorId: string;
}

export type LineDataEntry = (BN | number)[];

export type LineData = LineDataEntry[];

export interface ChartInfo {
  chart: LineData;
  labels: string[];
}
