// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Param$Type } from '@polkadot/params/types';
import { RawParam$Value } from './types';

import getInitValue from './initValue';

export default function getInitValueArray (type: Param$Type[]): RawParam$Value | Array<RawParam$Value> {
  // NOTE special cases for where we have a known override formatter. The only horrible thing with
  // this atm is that we need to add the same override in ./values.ts - which is actually horrible,
  // need a single place for both the actual raw values and wrapped values
  if (type.length === 1 && type[0] === 'KeyValueStorage') {
    return [];
  }

  return type.map((value) =>
    // NOTE since TS is not quite good at recursives, cast to a single
    getInitValue(value) as RawParam$Value
  );
}
