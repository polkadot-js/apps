// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import map from '@polkadot/storage-substrate/keys';

export default function createOptions (): Array<*> {
  return Object
    .keys(map)
    .sort()
    .map((name) => map[name])
    .filter(({ isDeprecated = false, isHidden = false, keys, name }) => {
      const methods = Object
        .values(keys)
        .filter(({ isDeprecated = false, isHidden = false, params = {} }) =>
          !isDeprecated &&
          !isHidden &&
          Object.keys(params).length === 0
        );

      return !isDeprecated && !isHidden && methods.length !== 0;
    })
    .map(({ name }) => ({
      text: name,
      value: name
    }));
}
