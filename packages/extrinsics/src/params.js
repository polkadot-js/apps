// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { ExtrinsicBase$Params, Extrinsic$Param, Extrinsic$Params } from './types';

module.exports = function expandParams (base: ExtrinsicBase$Params): Extrinsic$Params {
  const paramNames = Object.keys(base);

  return paramNames.map((name: string): Extrinsic$Param => {
    const source = base[name];

    return {
      ...source,
      name
    };
  });
};
