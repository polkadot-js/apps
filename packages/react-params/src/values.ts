// Copyright 2017-2020 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
