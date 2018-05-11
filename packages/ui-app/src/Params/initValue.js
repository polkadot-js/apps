// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow
// flowlint sketchy-null-mixed:off

import type { Param } from '@polkadot/primitives/param';

import BN from 'bn.js';

import isUndefined from '@polkadot/util/is/undefined';

export default function getInitValue ({ options: { initValue, minValue } = {}, type }: Param): mixed {
  if (Array.isArray(type)) {
    return type.map((type, index) =>
      getInitValue(({
        type,
        options: {
          initValue: isUndefined(initValue) || !Array.isArray(initValue)
            ? initValue
            : initValue[index],
          minValue: isUndefined(minValue) || !Array.isArray(minValue)
            ? minValue
            : minValue[index]
        }
      }: $Shape<Param>))
    );
  }

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
