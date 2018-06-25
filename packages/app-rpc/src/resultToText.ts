// Copyright 2017-2018 @polkadot/app-rpc authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import bnToHex from '@polkadot/util/bn/toHex';
import u8aToHex from '@polkadot/util/u8a/toHex';
import isBn from '@polkadot/util/is/bn';
import isObject from '@polkadot/util/is/object';
import isU8a from '@polkadot/util/is/u8a';

function resultToText (result: any): any {
  if (result === null || result === undefined) {
    return 'null';
  }

  if (isU8a(result)) {
    return u8aToHex(result);
  }

  if (isBn(result)) {
    return bnToHex(result);
  }

  if (Array.isArray(result)) {
    return result.map((value) =>
      resultToText(value)
    );
  }

  if (isObject(result)) {
    return JSON
      .stringify(
        Object
          .keys(result)
          .reduce((map, key) => {
            map[key] = resultToText((result as { [index: string]: string })[key]);

            return map;
          }, ({} as { [index: string]: string }))
      )
      .replace(/\\"/g, '"')
      .replace(/":"/g, '": "');
  }

  return result;
}

export default resultToText;
