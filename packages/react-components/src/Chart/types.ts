// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type BN from 'bn.js';

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
