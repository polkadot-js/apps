// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { GeneratorMatch } from './types';

function numberSort (a: number, b: number): number {
  if (a > b) {
    return -1;
  } else if (a < b) {
    return 1;
  }

  return 0;
}

export default function sort (a: GeneratorMatch, b: GeneratorMatch): number {
  const countResult = numberSort(a.count, b.count);

  if (countResult !== 0) {
    return countResult;
  }

  const positionResult = numberSort(b.offset, a.offset);

  if (positionResult !== 0) {
    return positionResult;
  }

  return a.address.localeCompare(b.address);
}
