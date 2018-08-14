// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import isValidBalance from './isValidBalance';

describe('checks extrinsic balance', () => {
  it('detects invalid balance for balance with non-positive integers or whitespace', () => {
    const invalidBalance = ' f403% 9';
    const chain = 'latest';

    expect(isValidBalance(invalidBalance, chain)).toEqual(false);
  });

  it('detects invalid balance for input with no length', () => {
    const invalidBalance = '';
    const chain = 'latest';

    expect(isValidBalance(invalidBalance, chain)).toEqual(false);
  });

  it('detects invalid balance for balance with positive integers with spaces between', () => {
    const invalidBalance = ' 05 9 ';
    const chain = 'latest';

    expect(isValidBalance(invalidBalance, chain)).toEqual(false);
  });

  it('detects valid balance for balance with positive integers', () => {
    const validBalance = ' 059 ';
    const chain = 'latest';

    expect(isValidBalance(validBalance, chain)).toEqual(true);
  });

  // max balance size for different chains are specified in @polkadot/params/sizes.ts
  it('detects valid balance is positive integers less than 128 bits maximum for latest chain', () => {
    const chainLatest = 'latest';
    const maxValidBalance128Bit = '340282366920938463463374607431768211455'; // 2^128 − 1

    expect(isValidBalance(maxValidBalance128Bit, chainLatest)).toEqual(true);
  });

  it('detects invalid balance for positive integers above the 128 bits maximum for latest chain', () => {
    const chainLatest = 'latest';
    const invalidBalance = '340282366920938463463374607431768211456'; // 2^128

    expect(isValidBalance(invalidBalance, chainLatest)).toEqual(false);
  });

  it('throws an error if input value for comparison is not a string', () => {
    const chainLatest = 'latest';
    const invalidInputValueType = 340282366920938463463374607431768211456;

    expect(() => {
      isValidBalance(invalidInputValueType, chainLatest);
    }).toThrow();
  });

  it('throws an error if input value for comparison is a string amount in scientific notation', () => {
    const chainLatest = 'latest';
    const invalidInputValueType = String(340282366920938463463374607431768211456); // '3.402823669209385e+38';

    expect(() => {
      isValidBalance(invalidInputValueType, chainLatest);
    }).toThrow();
  });

  it('detects valid balance is positive integers less than 64 bits maximum for poc-1 chain', () => {
    const chainPoC1 = 'poc-1';
    const maxValidBalance64Bit = '18446744073709551615'; // 2^64 − 1

    expect(isValidBalance(maxValidBalance64Bit, chainPoC1)).toEqual(true);
  });

  it('detects invalid balance for positive integers above the 64 bits maximum for poc-1 chain', () => {
    const chainPoC1 = 'poc-1';
    const invalidBalance = '18446744073709551616'; // 2^64

    expect(isValidBalance(invalidBalance, chainPoC1)).toEqual(false);
  });
});
