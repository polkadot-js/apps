// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Param$Types } from '@polkadot/params/types';

import React from 'react';

// import IdentityIcon from '@polkadot/ui-react/IdentityIcon';
import addressEncode from '@polkadot/util-keyring/address/encode';
import u8aToHexShort from '@polkadot/util/u8a/toHexShort';
import isU8a from '@polkadot/util/is/u8a';

// flowlint-next-line unclear-type:off
export default function format (type: Param$Types, value: any, key?: string = '0-'): Array<React$Node> {
  console.error('format', type, value, key);

  if (type === 'bool') {
    return [
      <span key={`${key}${type}`}>{value ? 'Yes' : 'No'}</span>
    ];
  }

  if (!value) {
    return [
      <span key={`${key}${type.toString()}`}>unknown</span>
    ];
  }

  if (Array.isArray(type)) {
    return type
      .map((_type, index) =>
        format(_type, value[index], `${key}${index}-`)
      )
      .reduce((result, arr) => {
        arr.forEach((entry) =>
          result.push(entry)
        );

        return result;
      }, []);
  }

  if (type === 'AccountId') {
    const address = addressEncode((value: Uint8Array));

    // const size = Math.floor(fontSize + (fontSize / 14) * 18);
    // <IdentityIcon size={size} value={address} />

    return [
      <span key={`${key}${type}`}>{address}</span>
    ];
  }

  if (isU8a(value)) {
    return [
      <span key={`${key}${type}`}>{u8aToHexShort((value: Uint8Array), 256)}</span>
    ];
  }

  return [
    <span key={`${key}${type}`}>{value.toString()}</span>
  ];
}
