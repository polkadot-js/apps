// Copyright 2016 Dan Finlay
// Copyright 2017-2018 @polkadot/ui-identicon authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import colors from './colors';
import newContainer from './container';
import newSeeder from './seeder';
import newShape from './shape/circle';
import newElement from './svg/element';
import { SHAPE_COUNT } from './defaults';

export default function identicon (seed: string | Uint8Array, diameter: number = 256, className: string = '', style?: { [index: string]: string }): HTMLElement {
  const seeder = newSeeder(seed);
  const colorGen = colors(seeder);
  const outer = newContainer(diameter, 'white', className, style);
  const container = newContainer(diameter, colorGen());
  const svg = newElement(diameter);

  outer.appendChild(container);
  container.appendChild(svg);

  for (let count = 0; count < SHAPE_COUNT; count++) {
    const fill = colorGen();
    const shape = newShape(seeder, fill, diameter, count);

    svg.appendChild(shape);
  }

  return outer;
}
