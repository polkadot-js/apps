// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import isValidBalance from './isValidBalance';
import { expectedIsValidResponse, ErrorMessage } from './isValidBalanceExpectedResponses';

describe('checks extrinsic balance', () => {
  it('detects invalid balance for balance with non-positive integers or whitespace', () => {
    const invalidBalance = ' f403% 9';

    expect(isValidBalance(invalidBalance)).toEqual(expectedIsValidResponse(false, ErrorMessage.BalanceMustBeNumber));
  });

  it('detects invalid balance for input with no length', () => {
    const invalidBalance = '';

    expect(isValidBalance(invalidBalance)).toEqual(expectedIsValidResponse(false, ErrorMessage.BalanceMinimumRequired));
  });

  it('detects invalid balance for balance with positive integers with spaces between', () => {
    const invalidBalance = ' 05 9 ';

    expect(isValidBalance(invalidBalance)).toEqual(expectedIsValidResponse(false, ErrorMessage.BalanceMustBeNumber));
  });

  it('detects valid balance for balance with positive integers', () => {
    const validBalance = ' 059 ';

    expect(isValidBalance(validBalance)).toEqual(expectedIsValidResponse(true));
  });

  // max balance size for different chains are specified in @polkadot/params/sizes.ts
  it('detects valid balance is positive integers less than 128 bits maximum for latest chain', () => {
    const maxValidBalance128Bit = '340282366920938463463374607431768211455'; // 2^128 − 1

    expect(isValidBalance(maxValidBalance128Bit)).toEqual(expectedIsValidResponse(true));
  });

  it('detects invalid balance for positive integers above the 128 bits maximum for latest chain', () => {
    const invalidBalance = '340282366920938463463374607431768211456'; // 2^128

    expect(isValidBalance(invalidBalance)).toEqual(expectedIsValidResponse(false, ErrorMessage.BalanceExceedsMaximum));
  });

  it('throws an error if input value for comparison is not a string', () => {
    const invalidInputValueType = 340282366920938463463374607431768211456;

    expect(() => {
      isValidBalance(invalidInputValueType);
    }).toThrow();
  });

  it('throws an error if input value for comparison is a string amount in scientific notation', () => {
    const invalidInputValueType = String(340282366920938463463374607431768211456); // '3.402823669209385e+38';

    expect(() => {
      isValidBalance(invalidInputValueType);
    }).toThrow();
  });
});
