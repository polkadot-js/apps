// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import map from '@polkadot/storage-substrate/keys';

// flowlint-next-line unclear-type:off
export default function createOptions (): Array<any> {
  return Object
    .keys(map)
    .sort()
    .filter((name) => {
      const { isDeprecated = false, keys } = map[name];
      const methods = Object
        .keys(keys)
        .filter((name) => {
          const { isDeprecated = false, isHidden = false } = keys[name];

          return !isDeprecated && !isHidden;
        });

      return !isDeprecated && methods.length !== 0;
    })
    .map((name) => ({
      text: name,
      value: name
    }));
}
