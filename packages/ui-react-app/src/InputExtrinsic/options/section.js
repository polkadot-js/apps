// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import map from '@polkadot/extrinsics-substrate';

type Creator = () => Array<*>;

export default function createOptions (type: 'private' | 'public'): Creator {
  return (): Array<*> => {
    return Object
      .keys(map)
      .sort()
      .map((name) => map[name])
      .filter(({ isDeprecated = false, isHidden = false, methods }) =>
        !isDeprecated &&
        !isHidden &&
        Object.keys(methods[type]).length !== 0
      )
      .map(({ name }) => ({
        text: name,
        value: name
      }));
  };
}
