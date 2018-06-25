// Copyright 2016 Dan Finlay
// Copyright 2017-2018 @polkadot/ui-identicon authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Seeder } from '../types';

import newCircle from '../svg/circle';
import { SHAPE_COUNT } from '../defaults';

export default function circle (seeder: Seeder, fill: string, diameter: number, count: number): Element {
  const center = diameter / 2;
  const angle = seeder() * 360;
  const radius = (((SHAPE_COUNT - count) / SHAPE_COUNT) * (diameter / 2)) + ((diameter / 8) * seeder());
  const offset = (diameter / 4) * (seeder() + ((count + 1) / SHAPE_COUNT));
  const cx = (offset * Math.sin(angle)) + center;
  const cy = (offset * Math.cos(angle)) + center;
  const svg = newCircle(radius, cx, cy);

  svg.setAttributeNS('', 'fill', fill);

  return svg;
};
