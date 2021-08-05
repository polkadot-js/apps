// Copyright 2017-2021 @polkadot/page-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

/**
 * Alternative to `Array.prototype.sort`, but stable,
 * which is often prefferd for UI.
 * Unlike the prototype method, this function does not sort inplace.
 *
 * @param elements Elements to be sorted.
 * @param cpm Comparison function.
 * @returns New sorted array.
 */
export default function<T> (elements: T[], cmp: (a: T, b: T) => number): T[] {
  const indexedElements: [T, number][] = elements.map((x, index) => [x, index]);
  const stableCmp = (a: [T, number], b: [T, number]) =>
    cmp(a[0], b[0]) || a[1] - b[1];

  indexedElements.sort(stableCmp);

  return indexedElements.map(([x]) => x);
}
