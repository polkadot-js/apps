// Copyright 2017-2019 @polkadot/react-hooks authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Params } from './types';

import { isNull, isUndefined } from '@polkadot/util';

export const dummyPromise = Promise.resolve((): void => {
  // we do nothing, this is a noop
});

export function transformIdentity (value: any): any {
  return value;
}

// extract the serialized and mapped params, all ready for use in our call
export function extractParams (fn: any, params: any[], paramMap: (params: any[]) => any): [string, Params | null] {
  return [
    JSON.stringify({ f: fn?.name, p: params }),
    params.length === 0 || !params.some((param): boolean => isNull(param) || isUndefined(null))
      ? paramMap(params)
      : null
  ];
}
