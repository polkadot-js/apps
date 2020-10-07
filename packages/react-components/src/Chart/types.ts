// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BareProps } from '../types';

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

export interface BaseProps extends BareProps {
  children: React.ReactNode;
}

export interface DoughnutProps extends BareProps {
  size?: number;
  values: DoughnutValue[];
}

export interface HorizBarProps extends BareProps {
  aspectRatio?: number;
  max?: number;
  showLabels?: boolean;
  values: HorizBarValue[];
  withColors?: boolean;
}

export interface LineProps extends BareProps {
  colors?: (string | undefined)[];
  labels: string[];
  legends: string[];
  values: (number | BN)[][];
}
