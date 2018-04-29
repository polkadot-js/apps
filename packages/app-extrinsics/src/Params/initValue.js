// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow
// flowlint sketchy-null-mixed:off

import type { Extrinsic$Param } from '@polkadot/extrinsics/types';

import BN from 'bn.js';

export default function getInitValue ({ options: { initValue, minValue } = {}, type }: Extrinsic$Param): mixed {
  switch (type) {
    case 'Balance':
    case 'BlockNumber':
    case 'u32':
    case 'u64':
      return new BN(initValue || minValue || 0);

    case 'bool':
      return initValue || false;

    case 'VoteThreshold':
      return initValue || 0;

    default:
      return initValue;
  }
}
