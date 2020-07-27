// Copyright 2017-2020 @canvas-ui/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { CodecArg, TypeDef } from '@polkadot/types/types';
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

export function extractValues (values: RawParam[]): CodecArg[] {
  return values.map(({ value }) => value as CodecArg);
}

export default function createValues (params: { type: TypeDef }[]): RawParam[] {
  return params.map(createValue);
}
