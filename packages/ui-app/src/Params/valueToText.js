// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type BN from 'bn.js';
import type { Param$Types, Param$Type$Array } from '@polkadot/params/types';

// import IdentityIcon from '@polkadot/ui-react/IdentityIcon';
import numberFormat from '@polkadot/ui-react-rx/util/numberFormat';
import addressEncode from '@polkadot/util-keyring/address/encode';
import u8aToHex from '@polkadot/util/u8a/toHex';
import isBn from '@polkadot/util/is/bn';
import isU8a from '@polkadot/util/is/u8a';

// flowlint-next-line unclear-type:off
function arrayToText (type: Param$Type$Array, value: Array<any>): string {
  if (value.length === 0) {
    return 'empty';
  }

  const values = type.map((_type, index) =>
    valueToText(_type, value[index])
  ).join(', ');

  return type.length === 1
    ? `(${values})`
    : values;
}

// flowlint-next-line unclear-type:off
function valueToText (type: Param$Types, value: any): string {
  if (type === 'bool') {
    return value ? 'Yes' : 'No';
  }

  if (!value) {
    return 'unknown';
  }

  if (Array.isArray(type)) {
    return arrayToText(type, value);
  }

  if (type === 'AccountId') {
    return addressEncode((value: Uint8Array));
  }

  if (isU8a(value)) {
    return u8aToHex((value: Uint8Array), 256);
  }

  if (isBn(value)) {
    return numberFormat((value: BN));
  }

  return value.toString();
}

export default valueToText;
