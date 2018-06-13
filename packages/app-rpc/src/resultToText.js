// Copyright 2017-2018 @polkadot/app-rpc authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import bnToHex from '@polkadot/util/bn/toHex';
import u8aToHex from '@polkadot/util/u8a/toHex';
import isBn from '@polkadot/util/is/bn';
import isObject from '@polkadot/util/is/object';
import isU8a from '@polkadot/util/is/u8a';

function resultToText (result: mixed): mixed {
  if (result === null || result === undefined) {
    return 'null';
  }

  if (isU8a(result)) {
    // $FlowFixMe type has been determined
    return u8aToHex(result);
  }

  if (isBn(result)) {
    // $FlowFixMe type has been determined
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
        // $FlowFixMe type has been determined
        Object
          .keys(result)
          .reduce((map, key) => {
            // $FlowFixMe type has been determined
            map[key] = resultToText(result[key]);

            return map;
          }, {})
      )
      .replace(/\\"/g, '"')
      .replace(/":"/g, '": "');
  }

  return result;
}

export default resultToText;
