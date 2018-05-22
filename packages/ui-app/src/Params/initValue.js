// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow
// flowlint sketchy-null-mixed:off

import type { Param$Type } from '@polkadot/params/types';

import BN from 'bn.js';

export default function getInitValue (type: Param$Type): ?mixed {
  switch (type) {
    case 'Balance':
      return new BN(1);

    case 'BlockNumber':
    case 'Index':
    case 'SessionKey':
    case 'u64':
    case 'PropIndex':
    case 'ReferendumIndex':
    case 'u32':
    case 'VoteIndex':
      return new BN(0);

    case 'bool':
      return false;

    case 'VoteThreshold':
      return 0;

    default:
      return void 0;
  }
}
