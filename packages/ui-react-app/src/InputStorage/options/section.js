// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import map from '@polkadot/storage-substrate/keys';

export default function createOptions (): Array<*> {
  return Object
    .keys(map)
    .sort()
    .filter((name) => {
      const { isDeprecated = false, keys } = map[name];
      const methods = Object
        .keys(keys)
        .filter((name) => {
          const { isDeprecated = false, isHidden = false, params = {} } = keys[name];

          return !isDeprecated && !isHidden && Object.keys(params).length === 0;
        });

      return !isDeprecated && methods.length !== 0;
    })
    .map((name) => ({
      text: name,
      value: name
    }));
}
