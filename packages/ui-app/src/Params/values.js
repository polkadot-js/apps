// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Param, Params } from '@polkadot/params/types';
import type { RawParam } from './types';

import isUndefined from '@polkadot/util/is/undefined';

import getInitValue from './initValue';

export default function values (params: Params): Array<RawParam> {
  return Object
    .values(params)
    // $FlowFixMe yes, we are sure, the type is correct
    .map(({ type, options }: Param): RawParam => {
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
            value: void 0
          };
        }

        return type.reduce(({ isValid, value }, type) => {
          // $FlowFixMe still not sure how to iterate through these
          const avalue = getInitValue(type, {});

          value.push(avalue);

          return {
            isValid: isValid && !isUndefined(avalue),
            value
          };
        }, { isValid: true, value: [] });
      }

      const value = getInitValue(type, options);

      return {
        isValid: !isUndefined(value),
        value
      };
    });
}

// 0x050000000600000055555555550ae803000000000000
