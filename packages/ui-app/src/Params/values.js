// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Params } from '@polkadot/params/types';
import type { RawParam, RawParam$ValueArray } from './types';

import isUndefined from '@polkadot/util/is/undefined';

import getInitValue from './initValue';

export default function values (params: Params): Array<RawParam> {
  const types = params.map(({ type }) => type);

  return types.map((type): RawParam => {
    if (Array.isArray(type)) {
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
      // FIXME Arrays are currently not valid as inputs, no rendered
      }, { isValid: false, type, value });
    }

    const value = getInitValue(type);

    return {
      isValid: !isUndefined(value),
      type,
      value
    };
  });
}
