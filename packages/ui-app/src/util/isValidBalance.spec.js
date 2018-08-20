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

    expect(isValidBalance(invalidBalance)).toEqual(expectedIsValidResponse(false, ErrorMessage.BalanceMustBeNumber));
  });

  it('detects valid balance for balance with positive integers with spaces between', () => {
    const validBalance = ' 05 9 ';

    expect(isValidBalance(validBalance)).toEqual(expectedIsValidResponse(true, undefined, '5.90e+1'));
  });

  it('detects valid balance for balance with positive integers', () => {
    const validBalance = ' 059 ';

    expect(isValidBalance(validBalance)).toEqual(expectedIsValidResponse(true, undefined, '5.90e+1'));
  });

  // max balance size for different chains are specified in @polkadot/params/sizes.ts
  it('detects valid balance is positive integers less than 128 bits maximum for latest chain', () => {
    const maxValidBalance128Bit = '340282366920938463463374607431768211454'; // 2^128 − 1

    expect(isValidBalance(maxValidBalance128Bit)).toEqual(expectedIsValidResponse(true, undefined, '3.40e+38'));
  });

  it('detects invalid balance for positive integers greater than or equal to the 128 bits maximum for latest chain', () => {
    const invalidBalance = '340282366920938463463374607431768211455'; // 2^128

    expect(isValidBalance(invalidBalance)).toEqual(expectedIsValidResponse(false, ErrorMessage.BalanceExceedsMaximum));
  });

  it('throws an error if input value for comparison is not a string', () => {
    const invalidInputValueType = 340282366920938463463374607431768211456;

    expect(() => {
      isValidBalance(invalidInputValueType);
    }).toThrow();
  });

  it('detects valid balance from conversion if input value for comparison is a string amount in exponential notation less than maximum', () => {
    let validInputValueExponentialType = String(340000000000000000000000000000000000000); // 3.4e+38

    expect(isValidBalance(validInputValueExponentialType)).toEqual(expectedIsValidResponse(true, undefined, '340000000000000000000000000000000000000', '340000000000000000000000000000000000000'));
  });

  it('detects invalid balance from conversion if input value for comparison is a string amount in exponential notation that exceeds maximum', () => {
    const invalidInputValueExponentialType = String(340282366920938463463374607431768211455); // '3.402823669209385e+38';

    expect(isValidBalance(invalidInputValueExponentialType)).toEqual(expectedIsValidResponse(false, ErrorMessage.BalanceExceedsMaximumExponentialNotation));
  });

  it('detects valid balance from conversion if input value for comparison is a string amount in scientific notation less than maximum', () => {
    let validInputValueScientificType = String(340000000000000000000000000000000000000); // 3.4e+38
    validInputValueScientificType = validInputValueScientificType.replace(/\+/g, ''); // 3.4e38

    expect(isValidBalance(validInputValueScientificType)).toEqual(expectedIsValidResponse(true, undefined, '340000000000000000000000000000000000000', '340000000000000000000000000000000000000'));
  });

  it('detects invalid balance from conversion if input value for comparison is a string amount in scientific notation that exceeds maximum', () => {
    let invalidInputValueExponentialType = String(340282366920938463463374607431768211455); // '3.402823669209385e+38';
    invalidInputValueExponentialType = invalidInputValueExponentialType.replace(/\+/g, ''); // '3.402823669209385e38';

    expect(isValidBalance(invalidInputValueExponentialType)).toEqual(expectedIsValidResponse(false, ErrorMessage.BalanceExceedsMaximumScientificNotation));
  });

  // TODO - add unit tests for other scenarios in isValidBalance
});
