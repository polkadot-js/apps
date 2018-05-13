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
export default function format (type: Param$Types, value?: any, fontSize?: number = 14): any {
  if (type === 'bool') {
    return (
      <span>{value
        ? 'Yes'
        : 'No'
      }</span>
    );
  }

  if (!value) {
    return (
      <span>unknown</span>
    );
  }

  if (Array.isArray(type)) {
    return type.map((_type, index) =>
      format(_type, value[index], fontSize)
    );
  }

  if (type === 'AccountId') {
    const address = addressEncode((value: Uint8Array));

    // const size = Math.floor(fontSize + (fontSize / 14) * 18);
    // <IdentityIcon size={size} value={address} />

    return (
      <span>{address}</span>
    );
  }

  if (isU8a(value)) {
    return (
      <span>{u8aToHexShort((value: Uint8Array), 256)}</span>
    );
  }

  return (
    <span>{value.toString()}</span>
  );
}
