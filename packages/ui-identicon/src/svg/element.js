// Copyright 2016 Dan Finlay
// Copyright 2017-2018 @polkadot/ui-identicon authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

const svg = require('./svg');

module.exports = function element (size: number, type: string = 'svg', x: number = 0, y: number = 0): Element {
  const elem = svg(type);

  elem.setAttributeNS(null, 'x', `${x}`);
  elem.setAttributeNS(null, 'y', `${y}`);
  elem.setAttributeNS(null, 'width', `${size}`);
  elem.setAttributeNS(null, 'height', `${size}`);

  return elem;
};
