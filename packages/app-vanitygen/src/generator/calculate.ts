// Copyright 2017-2018 @polkadot/app-vanitygen authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Generator$Calculation, Generator$Options } from './types';

function calculateAt (atOffset: number, test: Array<string>, address: string): Generator$Calculation {
  return {
    count: test.reduce((count, c, index) => {
      if (index === count) {
        count += (c === '?' || c === address.charAt(index + atOffset)) ? 1 : 0;
      }

      return count;
    }, 0),
    offset: atOffset
  };
}

export default function calculate (test: Array<string>, _address: string, { atOffset = -1, withCase = false }: Generator$Options): Generator$Calculation {
  const address = withCase
    ? _address
    : _address.toLowerCase();

  if (atOffset > 0) {
    return calculateAt(atOffset, test, address);
  }

  const maxOffset = address.length - test.length - 1;
  let bestCount = 0;
  let bestOffset = 1;

  for (let index = 1; index < maxOffset; index++) {
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
