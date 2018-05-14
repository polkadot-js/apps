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
        console.error('Unable to determine default values for array type', type);

        return {
          isValid: false,
          value: void 0
        };
      }

      const value = getInitValue(type, options);

      return {
        isValid: !isUndefined(value),
        value
      };
    });
}
