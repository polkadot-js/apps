// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { GeneratorCalculation, GeneratorOptions } from './types';

const MAX_OFFSET = 5;

function calculateAtOne (atOffset: number, test: string[], address: string): GeneratorCalculation {
  return {
    count: test.reduce((count, c, index): number => {
      if (index === count) {
        count += (c === '?' || c === address.charAt(index + atOffset)) ? 1 : 0;
      }

      return count;
    }, 0),
    offset: atOffset
  };
}

function calculateAt (atOffset: number, test: string[][], address: string): GeneratorCalculation {
  let bestCount = 0;
  let bestOffset = 1;

  for (let i = 0; i < test.length; i++) {
    const { count, offset } = calculateAtOne(atOffset, test[i], address);

    if (count > bestCount) {
      bestCount = count;
      bestOffset = offset;
    }
  }

  return {
    count: bestCount,
    offset: bestOffset
  };
}

export default function calculate (test: string[][], _address: string, { atOffset = -1, withCase = false }: GeneratorOptions): GeneratorCalculation {
  const address = withCase
    ? _address
    : _address.toLowerCase();

  if (atOffset > 0) {
    return calculateAt(atOffset, test, address);
  }

  let bestCount = 0;
  let bestOffset = 1;

  for (let index = 0; index < MAX_OFFSET; index++) {
    const { count, offset } = calculateAt(index, test, address);

    if (count > bestCount) {
      bestCount = count;
      bestOffset = offset;
    }
  }

  return {
    count: bestCount,
    offset: bestOffset
  };
}
