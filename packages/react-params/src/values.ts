// Copyright 2017-2025 @polkadot/react-params authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Registry, TypeDef } from '@polkadot/types/types';
import type { RawParam } from './types.js';

import { isUndefined } from '@polkadot/util';

import getInitValue from './initValue.js';

export function createValue (registry: Registry, param: { type: TypeDef }): RawParam {
  const value = getInitValue(registry, param.type);

  return {
    isValid: !isUndefined(value),
    value
  };
}

export default function createValues (registry: Registry, params: { type: TypeDef }[]): RawParam[] {
  return params.map((param) => createValue(registry, param));
}
