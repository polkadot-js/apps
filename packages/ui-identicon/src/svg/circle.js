// Copyright 2017-2018 @polkadot/ui-identicon authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

const svg = require('./svg');

module.exports = function circle (r: number, cx: number, cy: number): Element {
  const elem = svg('circle');

  elem.setAttributeNS(null, 'cx', `${cx}`);
  elem.setAttributeNS(null, 'cy', `${cy}`);
  elem.setAttributeNS(null, 'r', `${r}`);

  return elem;
};
