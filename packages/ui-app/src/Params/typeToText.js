// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Param$Types } from '@polkadot/params/types';

export default function typeToText (type: Param$Types): string {
  if (!Array.isArray(type)) {
    return type;
  }

  if (type.length !== 1) {
    return `(${type.map(typeToText).join(', ')})`;
  }

  return `Array<${type.map(typeToText).join(', ')}>`;
}
