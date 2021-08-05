// Copyright 2017-2021 @polkadot/page-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import stableSort from './stableSort';

const numCmp = (a: number, b: number) => a - b;
const pairCmp = ([x1]: [number, number], [x2]: [number, number]) => x1 - x2;

describe('stableSort', () => {
  it('empty array', () => {
    expect(stableSort([], numCmp)).toEqual([]);
  });

  it('all different elements array', () => {
    expect(stableSort([1, 3, 4, 2], numCmp)).toEqual([1, 2, 3, 4]);
  });

  it('some duplicated elements array', () => {
    expect(stableSort([1, 3, 4, 3, 2], numCmp)).toEqual([1, 2, 3, 3, 4]);
  });

  it('stable with duplicated elements', () => {
    expect(stableSort([[1, 1], [3, 2], [4, 3], [3, 4], [2, 5]], pairCmp))
      .toEqual([[1, 1], [2, 5], [3, 2], [3, 4], [4, 3]]);

    expect(stableSort([[1, 1], [3, 4], [4, 3], [3, 2], [2, 5]], pairCmp))
      .toEqual([[1, 1], [2, 5], [3, 4], [3, 2], [4, 3]]);
  });
});
