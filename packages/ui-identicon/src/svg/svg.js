// Copyright 2016 Dan Finlay
// Copyright 2017-2018 @polkadot/ui-identicon authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

const SVG_NS = 'http://www.w3.org/2000/svg';

module.exports = function svg (type: string): Element {
  return document.createElementNS(SVG_NS, type);
};
