// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TypeDef } from '@polkadot/types';
import { RawParam } from './types';

import { isUndefined } from '@polkadot/util';

import getInitValue from './initValue';

export default function values (params: Array<{ type: TypeDef }>): Array<RawParam> {
  return params.map(({ type }): RawParam => {
    const value = getInitValue(type);

    return {
      isValid: !isUndefined(value),
      value
    };
  });
}
