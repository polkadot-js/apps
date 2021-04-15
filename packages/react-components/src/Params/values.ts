// Copyright 2017-2021 @polkadot/react-components authors & contributors
// and @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { CodecArg, TypeDef } from '@polkadot/types/types';
import { isUndefined } from '@polkadot/util';

import { RawParam } from '../types';
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
