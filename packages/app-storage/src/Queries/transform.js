// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type BN from 'bn.js';
import type { StorageDef$Key } from '@polkadot/storage/types';

import u8aToHexShort from '@polkadot/util/u8a/toHexShort';
import isU8a from '@polkadot/util/is/u8a';

type Formatter = (value: boolean | BN | Date | Uint8Array) => string;

export default function transform ({ type }: StorageDef$Key): Formatter {
  return (value: boolean | BN | Date | Uint8Array): string => {
    if (typeof value === typeof true) {
      return value
        ? 'Yes'
        : 'No';
    }

    if (!value) {
      return 'unknown';
    }

    if (isU8a(value)) {
      // $FlowFixMe type has been determined
      return u8aToHexShort(value, 256);
    }

    return value.toString();
  };
}
