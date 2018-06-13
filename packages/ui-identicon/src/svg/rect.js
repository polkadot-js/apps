// Copyright 2017-2018 @polkadot/ui-identicon authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

const element = require('./element');

module.exports = function rect (size: number): Element {
  const elem = element(size, 'rect');

  elem.setAttributeNS(null, 'rx', `${size / 16}`);
  elem.setAttributeNS(null, 'ry', `${size / 16}`);

  return elem;
};
