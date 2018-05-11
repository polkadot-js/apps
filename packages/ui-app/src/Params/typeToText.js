// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Param$Type, Param$TypeArray } from '@polkadot/primitives/param';

export default function typeToText (type: Param$Type | Param$TypeArray): string {
  if (Array.isArray(type)) {
    return `Array<${type.map(typeToText).join(', ')}>`;
  }

  return type;
}
