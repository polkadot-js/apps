// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Param, Params } from '@polkadot/primitives/param';
import type { RawParam } from './types';

import isUndefined from '@polkadot/util/is/undefined';

import getInitValue from './initValue';

export default function values (params: Params): Array<RawParam> {
  return Object
    .values(params)
    // $FlowFixMe yes, we are sure, the type is correct
    .map((param: Param): RawParam => {
      const value = getInitValue(param);

      return {
        isValid: !isUndefined(value),
        value
      };
    });
}
