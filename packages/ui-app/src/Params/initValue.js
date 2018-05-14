// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow
// flowlint sketchy-null-mixed:off

import type { Param$Type } from '@polkadot/params/types';

import BN from 'bn.js';

type Options = {
  initValue?: mixed,
  minValue?: mixed
};

export default function getInitValue (type: Param$Type, { initValue, minValue }: Options = {}): ?mixed {
  switch (type) {
    case 'Balance':
    case 'BlockNumber':
    case 'Index':
    case 'SessionKey':
    case 'u64':
    case 'PropIndex':
    case 'ReferendumIndex':
    case 'u32':
    case 'VoteIndex':
      return new BN(initValue || minValue || 0);

    case 'bool':
      return initValue || false;

    case 'VoteThreshold':
      return initValue || 0;

    default:
      return initValue;
  }
}
