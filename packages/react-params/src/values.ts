// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TypeDef } from '@polkadot/types/types';
import { RawParam } from './types';

import { isUndefined } from '@polkadot/util';

import getInitValue from './initValue';

export function createValue (param: { type: TypeDef }): RawParam {
  const value = getInitValue(param.type);

  return {
    isValid: !isUndefined(value),
    value
  };
}

export default function createValues (params: { type: TypeDef }[]): RawParam[] {
  return params.map(createValue);
}
