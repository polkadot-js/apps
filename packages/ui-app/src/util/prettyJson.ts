// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import bnToHex from '@polkadot/util/bn/toHex';
import u8aToHex from '@polkadot/util/u8a/toHex';
import isBn from '@polkadot/util/is/bn';
import isFunction from '@polkadot/util/is/function';
import isObject from '@polkadot/util/is/object';
import isU8a from '@polkadot/util/is/u8a';

function format (key: string | number, value: any): any {
  if (isU8a(value)) {
    return u8aToHex(value);
  }

  if (isBn(value)) {
    return bnToHex(value);
  }

  if (Array.isArray(value)) {
    return value.map((entry, index) =>
      format(index, entry)
    );
  }

  if (isObject(value) && !isFunction(value.toString)) {
    const obj = value as { [index: string]: any };

    return Object.keys(obj).reduce((map, key) => {
      map[key] = format(key, obj[key]);

      return map;
    }, {} as { [index: string]: any });
  }

  return value;
}

export default function prettyJson (value: any): string {
  return JSON.stringify(value, format);
}
