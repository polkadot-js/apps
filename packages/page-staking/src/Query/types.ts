// Copyright 2017-2020 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

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
