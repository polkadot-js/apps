// Copyright 2017-2021 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

export type HorizontalPosition = 'left' | 'middle' | 'right';

export type VerticalPosition = 'top' | 'bottom';

export interface ElementPosition {
  x: number,
  y: number,
  width: number,
  height: number,
}

export interface WindowSize {
  width: number;
  height: number;
}
