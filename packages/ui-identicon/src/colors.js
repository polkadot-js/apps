// Copyright 2016 Dan Finlay
// Copyright 2017-2018 @polkadot/ui-identicon authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Seeder } from './types';

type ColorGen = {
  (alpha?: number): string
};

const Color = require('color');

const { COLORS } = require('./defaults');

const WOBBLE = 30;

module.exports = function colors (seeder: Seeder): ColorGen {
  const amount = (seeder() * WOBBLE) - (WOBBLE / 2);
  const all = COLORS.map((hex) => Color(hex).rotate(amount));

  return (alpha: number = 0.9): string => {
    const index = Math.floor(all.length * seeder());

    return all.splice(index, 1)[0]
      .alpha(alpha)
      .string();
  };
};
