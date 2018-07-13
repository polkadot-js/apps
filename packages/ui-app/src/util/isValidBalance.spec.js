// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import isValidBalance from './isValidBalance';

describe('checks extrinsic balance', () => {
  it('detects invalid balance for balance with non-positive integers or whitespace', () => {
    const invalidBalance = ' f403% 9';

    expect(isValidBalance(invalidBalance)).toEqual(false);
  });

  it('detects invalid balance for input with no length', () => {
    const invalidBalance = '';

    expect(isValidBalance(invalidBalance)).toEqual(false);
  });

  it('detects valid balance for balance with positive integers even with whitespace', () => {
    const validBalance = ' 05 9 ';

    expect(isValidBalance(validBalance)).toEqual(true);
  });
});