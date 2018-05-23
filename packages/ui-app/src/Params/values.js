// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Params } from '@polkadot/params/types';
import type { RawParam, RawParam$ValueArray } from './types';

import isUndefined from '@polkadot/util/is/undefined';

import getInitValue from './initValue';

export default function values (params: Params): Array<RawParam> {
  const types = Object.keys(params).map((key) => params[key].type);

  return types.map((type): RawParam => {
    if (Array.isArray(type)) {
      // console.error('Unable to determine default values for array/tuple type', type);
      //
      // return {
      //   isValid: false,
      //   value: void 0
      // };

      if (type.length !== 1) {
        console.error('Unable to determine default values for tuple type', type);

        return {
          isValid: false,
          type,
          value: void 0
        };
      }

      const value: RawParam$ValueArray = [];

      return type.reduce(({ isValid, type }, subtype) => {
        const avalue = getInitValue(subtype);

        value.push(avalue);

        return {
          isValid: isValid && !isUndefined(avalue),
          type,
          value
        };
      }, { isValid: true, type, value });
    }

    const value = getInitValue(type);

    return {
      isValid: !isUndefined(value),
      type,
      value
    };
  });
}
