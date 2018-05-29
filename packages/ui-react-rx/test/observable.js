// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

const createObservable = require('@polkadot/api-rx/observable');

module.exports = function observable (method) {
  const fn = () => Promise.resolve(12345);

  fn.unsubscribe = () => Promise.resolve(true);

  return createObservable(`section_${method}`, method, {
    [method]: fn
  })();
};
