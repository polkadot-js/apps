// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';

export interface DoughnutValue {
  colors: string[];
  label: string;
  value: number | BN;
}

export interface HorizBarValue {
  colors: string[];
  label: string;
  tooltip?: string;
  value: number | BN;
}

export interface BaseProps {
  children: React.ReactNode;
  className?: string;
}

export interface DoughnutProps {
  className?: string;
  size?: number;
  values: DoughnutValue[];
}

export interface HorizBarProps {
  aspectRatio?: number;
  className?: string;
  max?: number;
  showLabels?: boolean;
  values: HorizBarValue[];
  withColors?: boolean;
}

export interface LineProps {
  colors?: (string | undefined)[];
  className?: string;
  labels: string[];
  legends: string[];
  values: (number | BN)[][];
}
