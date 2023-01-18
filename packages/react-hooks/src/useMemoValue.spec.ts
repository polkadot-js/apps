// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { isDifferent } from './useMemoValue';

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
});
