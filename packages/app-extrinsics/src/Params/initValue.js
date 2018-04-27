// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic$Param } from '../extrinsics/types';

import BN from 'bn.js';

export default function getInitValue ({ options: { initValue, minValue } = {}, type }: Extrinsic$Param): mixed {
  // flowlint-next-line sketchy-null-mixed:off
  const defaultValue = initValue || minValue;

  switch (type) {
    case 'Balance':
    case 'BlockNumber':
    case 'u32':
    case 'u64':
      // flowlint-next-line sketchy-null-mixed:off
      return new BN(defaultValue || 0);

    default:
      return defaultValue;
  }
}
