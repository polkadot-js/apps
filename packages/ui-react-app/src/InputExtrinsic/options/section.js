// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

const map = require('@polkadot/extrinsics-substrate');

module.exports = function createOptions (type: 'private' | 'public'): Array<*> {
  return Object
    .keys(map)
    .sort()
    .filter((name) => {
      const methods = map[name].methods[type];

      return Object.keys(methods).length !== 0;
    })
    .map((name) => ({
      text: name,
      value: name
    }));
};
