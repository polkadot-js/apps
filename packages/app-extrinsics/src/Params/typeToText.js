// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Extrinsic$Type } from '@polkadot/extrinsics/types';

export default function typeToText (type: Extrinsic$Type): string {
  if (Array.isArray(type)) {
    const [outer, inner] = type;

    return `${outer}<${inner}>`;
  }

  return type;
}
