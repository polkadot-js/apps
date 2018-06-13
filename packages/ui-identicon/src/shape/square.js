// Copyright 2016 Dan Finlay
// Copyright 2017-2018 @polkadot/ui-identicon authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Seeder } from '../types';

const newRect = require('../svg/rect');
const { SHAPE_COUNT } = require('../defaults');

module.exports = function square (seeder: Seeder, fill: string, diameter: number, count: number): Element {
  const center = diameter / 2;
  const svg = newRect(diameter);
  const firstRot = seeder();
  const angle = Math.PI * 2 * firstRot;
  const scale = count / SHAPE_COUNT;
  const velocity = ((diameter / SHAPE_COUNT) * seeder()) + (scale * diameter);
  const tx = (Math.cos(angle) * velocity).toFixed(3);
  const ty = (Math.sin(angle) * velocity).toFixed(3);
  const rot = ((firstRot * 360) + (seeder() * 180)).toFixed(1);

  svg.setAttributeNS(null, 'transform', `translate(${tx} ${ty}) rotate(${rot} ${center} ${center})`);
  svg.setAttributeNS(null, 'fill', fill);

  return svg;
};
