// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type BN from 'bn.js';
import type { Param$Types } from '@polkadot/params/types';

// import IdentityIcon from '@polkadot/ui-react/IdentityIcon';
import numberFormat from '@polkadot/ui-react-rx/util/numberFormat';
import addressEncode from '@polkadot/util-keyring/address/encode';
import u8aToHexShort from '@polkadot/util/u8a/toHexShort';
import isBn from '@polkadot/util/is/bn';
import isU8a from '@polkadot/util/is/u8a';

// flowlint-next-line unclear-type:off
export default function valueToText (type: Param$Types, value: any): string {
  if (type === 'bool') {
    return value ? 'Yes' : 'No';
  }

  if (!value) {
    return 'unknown';
  }

  if (Array.isArray(type)) {
    if (value.length === 0) {
      return 'empty';
    }

    const values = type.map((_type, index) =>
      // $FlowFixMe hate doing this, but it _looks_ ok
      valueToText(_type, value[index])
    ).join(', ');

    return type.length === 1
      ? `(${values})`
      : values;
  }

  if (type === 'AccountId') {
    return addressEncode((value: Uint8Array));
  }

  if (isU8a(value)) {
    return u8aToHexShort((value: Uint8Array), 256);
  }

  if (isBn(value)) {
    return numberFormat((value: BN));
  }

  return value.toString();
}
