// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Param$Type, Param$TypeArray } from '@polkadot/primitives/param';

import addressEncode from '@polkadot/util-keyring/address/encode';
import u8aToBn from '@polkadot/util/u8a/toBn';
import u8aToHexShort from '@polkadot/util/u8a/toHexShort';
import isU8a from '@polkadot/util/is/u8a';

// flowlint-next-line unclear-type:off
export default function format (type: Param$Type | Param$TypeArray, value?: any): string {
  if (type === 'bool') {
    return value
      ? 'Yes'
      : 'No';
  }

  if (!value) {
    return 'unknown';
  }

  // FIXME: this is a hack, but just to get it going, we should be going through and decoding arrays properly
  if (Array.isArray(type)) {
    const u8a = (value: Uint8Array);
    const length = u8aToBn(u8a.slice(0, 4), true).toNumber();
    const result = [];
    let offset = 4;

    // FIXME: 32? Only for Hash & AccountId ...
    for (let i = 0; i < length; i++, offset += 32) {
      result.push(format(type[0], u8a.slice(offset, offset + 32)));
    }

    return result.join(', ');
  }

  if (type === 'AccountId') {
    return addressEncode((value: Uint8Array));
  }

  if (isU8a(value)) {
    return u8aToHexShort((value: Uint8Array), 256);
  }

  return value.toString();
}
