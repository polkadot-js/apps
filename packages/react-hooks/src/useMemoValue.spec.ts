// Copyright 2017-2025 @polkadot/react-hooks authors & contributors
// SPDX-License-Identifier: Apache-2.0

/// <reference types="@polkadot/dev-test/globals.d.ts" />

import { stringify } from '@polkadot/util';

import { getMemoValue, isDifferent } from './useMemoValue.js';

describe('useMemoValue', (): void => {
  describe('isDifferent', (): void => {
    it('works on straight references', (): void => {
      expect(isDifferent(1, 2)).toEqual(true);
      expect(isDifferent(null, false)).toEqual(true);
      expect(isDifferent({}, [])).toEqual(true);
      expect(isDifferent(2, 2)).toEqual(false);
    });

    it('compares flat arrays', (): void => {
      expect(isDifferent([1, 2, 3], [1, 2, 3])).toEqual(false);
      expect(isDifferent([1, 2, 3], [4, 5, 6])).toEqual(true);
      expect(isDifferent([1, 2, 3, 4], [1, 2, 3])).toEqual(true);
    });

    it('compares 1-level-nested arrays', (): void => {
      expect(isDifferent(
        [1, [2, 3]],
        [1, [2, 3]]
      )).toEqual(false);
      expect(isDifferent(
        [1, [2, 3]],
        [1, [2]]
      )).toEqual(true);
      expect(isDifferent(
        [1, [2, 3]],
        [1, [3, 2]]
      )).toEqual(true);
      expect(isDifferent(
        [1, [2, 3], 4],
        [1, [2, 3], 4]
      )).toEqual(false);
    });

    it('compares 2-level-nested arrays', (): void => {
      const V34 = [3, 4];

      // this one is same since the [3, 4] compares by ref
      expect(isDifferent(
        [1, [2, V34]],
        [1, [2, V34]]
      )).toEqual(false);
      // this one is different since the [3, 4] is at level 2
      expect(isDifferent(
        [1, [2, V34]],
        [1, [2, [3, 4]]]
      )).toEqual(true);
      // this one is different since the [3, 4] is at level 2
      expect(isDifferent(
        [1, [2, [3, 4]]],
        [1, [2, [3, 4]]]
      )).toEqual(true);
    });
  });

  describe('getMemoValue', (): void => {
    it('returns a new value when the previous is empty', (): void => {
      expect(getMemoValue({ current: null }, 2)).toEqual(2);
    });

    it('returns a new value when the previous is a different type', (): void => {
      expect(getMemoValue<unknown>({ current: { stringified: stringify({ value: 2 }), value: 2 } }, '2')).toEqual('2');
    });

    it('returns the previous value when different objects, but the same representation', (): void => {
      const a = { some: { thing: 'test', zaz: [1, 2, 3] } };
      const b = { some: { thing: 'test', zaz: [1, 2, 3] } };

      expect(a === b).toEqual(false);
      expect(getMemoValue({ current: { stringified: stringify({ value: a }), value: a } }, b) === a).toEqual(true);
    });
  });
});
