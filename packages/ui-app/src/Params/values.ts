// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { TypeDef, TypeDefInfo } from '@polkadot/types/codec';
import { RawParam } from './types';

import { isUndefined } from '@polkadot/util';

import getInitValue from './initValue';

export default function values (params: Array<{ type: TypeDef }>): Array<RawParam> {
  return params.map(({ type }): RawParam => {
    if (type.info !== TypeDefInfo.Plain) {
      console.error('Unable to determine default values for type', type);

      return {
        isValid: false,
        value: void 0
      };

      // // NOTE special cases for where we have a known override formatter. See comments
      // // in ./inintValueArray.ts
      // if (type[0] === 'KeyValueStorage') {
      //   return {
      //     isValid: false, // invalid to start with, empty array
      //     value: []
      //   };
      // }
    }

    const value = getInitValue(type);

    return {
      isValid: !isUndefined(value),
      value
    };
  });
}
