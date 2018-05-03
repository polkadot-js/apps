// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import u8aToHexShort from '@polkadot/util/u8a/toHexShort';
import isU8a from '@polkadot/util/is/u8a';

export default function transform (value: BN | Uint8Array): string {
  if (!value) {
    return 'unknown';
  }

  if (isU8a(value)) {
    return u8aToHexShort(value, 256);
  }

  return value.toString();
}
