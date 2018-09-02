// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BIT_LENGTH_128 } from '../constants';
import isValidBalance from './isValidBalance';
import { ErrorMessage, WarnMessage } from './isValidBalanceExpectedResponses';
import translate from '../translate';

describe('checks extrinsic balance', () => {
  let t;

  beforeEach(() => {
    t = translate;
  });

  it('throws an error if input value for comparison is not a string', () => {
    const invalidInputValueType = 340282366920938463463374607431768211456;

    expect(() => {
      isValidBalance(invalidInputValueType, t, BIT_LENGTH_128);
    }).toThrow();
  });

  it('shows an error message when more than one instance of scientific notation with \'e\' used', () => {
    let invalidWithMultipleE = '3.4e00e';
    const { isValid, errorMessageUntranslated } = isValidBalance(invalidWithMultipleE, t);

    expect(isValid).toEqual(false);
    expect(errorMessageUntranslated).toEqual(ErrorMessage.MustContainOnlySingleEOrPlus);
  });

  it('shows an error message when more than one instance of  \'+\' used for exponential notation (with or without \'e\')', () => {
    let invalidWithMultiplePlus = '3.4+00+';
    const { isValid, errorMessageUntranslated } = isValidBalance(invalidWithMultiplePlus, t);

    expect(isValid).toEqual(false);
    expect(errorMessageUntranslated).toEqual(ErrorMessage.MustContainOnlySingleEOrPlus);
  });

  it('shows an error message when a exponential notation used without an exponent', () => {
    let invalidExponentialNotationWithoutExponent = '3.4e+';
    const { isValid, errorMessageUntranslated } = isValidBalance(invalidExponentialNotationWithoutExponent, t);

    expect(isValid).toEqual(false);
    expect(errorMessageUntranslated).toEqual(ErrorMessage.ExponentialNotationMissingExponent);
  });

  it('shows an error message when a scientific notation used without an exponent', () => {
    let invalidScientificNotationWithoutExponent = '3.4e';
    const { isValid, errorMessageUntranslated } = isValidBalance(invalidScientificNotationWithoutExponent, t);

    expect(isValid).toEqual(false);
    expect(errorMessageUntranslated).toEqual(ErrorMessage.ScientificNotationMissingExponent);
  });

  it('detects invalid balance for balance with non-positive integers or whitespace', () => {
    const invalidBalance = ' f403% 9';
    const { isValid, errorMessageUntranslated } = isValidBalance(invalidBalance, t);

    expect(isValid).toEqual(false);
    expect(errorMessageUntranslated).toEqual(ErrorMessage.MustBeNumber);
  });

  it('detects invalid balance for input with no length', () => {
    const invalidBalance = '';
    const { isValid, errorMessageUntranslated } = isValidBalance(invalidBalance, t);

    expect(isValid).toEqual(false);
    expect(errorMessageUntranslated).toEqual(ErrorMessage.MustBeNumber);
  });

  it('detects valid balance for input that is 0', () => {
    const validBalance = '0';
    const { isValid, warnMessageUntranslated } = isValidBalance(validBalance, t);

    expect(isValid).toEqual(true);
    expect(warnMessageUntranslated).toEqual(WarnMessage.Zero);
  });

  it('shows an error message when an infinite value generated from the provided scientific or exponential notation', () => {
    let invalidInfiniteValue = '3.4e308';
    const { isValid, errorMessageUntranslated } = isValidBalance(invalidInfiniteValue, t, BIT_LENGTH_128);

    expect(isValid).toEqual(false);
    expect(errorMessageUntranslated).toEqual(ErrorMessage.MustBeFinite);
  });

  it('shows an error message when a decimal point used without scientific or exponential notation', () => {
    let invalidDecimalWithoutE = '3.4';
    const { isValid, errorMessageUntranslated } = isValidBalance(invalidDecimalWithoutE, t);

    expect(isValid).toEqual(false);
    expect(errorMessageUntranslated).toEqual(ErrorMessage.WithDecimalsOnlyWithE);
  });

  it('detects invalid balance for positive integers greater than or equal to the 128 bits maximum for latest chain', () => {
    const invalidBalance = '340282366920938463463374607431768211455'; // 2^128
    const { isValid, errorMessageUntranslated } = isValidBalance(invalidBalance, t, BIT_LENGTH_128);

    expect(isValid).toEqual(false);
    expect(errorMessageUntranslated).toEqual(ErrorMessage.AboveMax);
  });

  it('detects valid balance for balance with positive integers with spaces between', () => {
    const validBalance = ' 05 9 ';
    const { isValid, infoMessage } = isValidBalance(validBalance, t);

    expect(isValid).toEqual(true);
    expect(infoMessage).toEqual('5.90e+1');
  });

  it('detects valid balance for balance with positive integers', () => {
    const validBalance = ' 059 ';
    const { isValid, infoMessage } = isValidBalance(validBalance, t);

    expect(isValid).toEqual(true);
    expect(infoMessage).toEqual('5.90e+1');
  });

  // max balance size for different chains are specified in @polkadot/params/sizes.ts
  it('detects valid balance is positive integers less than 128 bits maximum for latest chain', () => {
    const maxValidBalance128Bit = '340282366920938463463374607431768211454'; // 2^128 − 1
    const { isValid, infoMessage } = isValidBalance(maxValidBalance128Bit, t, BIT_LENGTH_128);

    expect(isValid).toEqual(true);
    expect(infoMessage).toEqual('3.40e+38');
  });

  it('detects valid balance from conversion if input value for comparison is a string amount in scientific notation less than maximum', () => {
    let validInputValueScientificType = String(340000000000000000000000000000000000000); // 3.4e+38
    validInputValueScientificType = validInputValueScientificType.replace(/\+/g, ''); // 3.4e38
    const { isValid, infoMessage, num } = isValidBalance(validInputValueScientificType, t, BIT_LENGTH_128);

    expect(isValid).toEqual(true);
    expect(infoMessage).toEqual('340000000000000000000000000000000000000');
    expect(num).toEqual('340000000000000000000000000000000000000');
  });

  it('detects invalid balance from conversion if input value for comparison is a string amount in scientific notation that exceeds maximum', () => {
    let invalidInputValueExponentialType = String(340282366920938463463374607431768211455); // '3.402823669209385e+38';
    invalidInputValueExponentialType = invalidInputValueExponentialType.replace(/\+/g, ''); // '3.402823669209385e38';
    const { isValid, errorMessageUntranslated } = isValidBalance(invalidInputValueExponentialType, t, BIT_LENGTH_128);

    expect(isValid).toEqual(false);
    expect(errorMessageUntranslated).toEqual(ErrorMessage.AboveMaxScientificNotation);
  });

  it('detects valid balance from conversion if input value for comparison is a string amount in exponential notation less than maximum', () => {
    let validInputValueExponentialType = String(340000000000000000000000000000000000000); // 3.4e+38
    const { isValid, infoMessage, num } = isValidBalance(validInputValueExponentialType, t, BIT_LENGTH_128);

    expect(isValid).toEqual(true);
    expect(infoMessage).toEqual('340000000000000000000000000000000000000');
    expect(num).toEqual('340000000000000000000000000000000000000');
  });

  it('detects invalid balance from conversion if input value for comparison is a string amount in exponential notation that exceeds maximum', () => {
    const invalidInputValueExponentialType = String(340282366920938463463374607431768211455); // '3.402823669209385e+38';
    const { isValid, errorMessageUntranslated } = isValidBalance(invalidInputValueExponentialType, t, BIT_LENGTH_128);

    expect(isValid).toEqual(false);
    expect(errorMessageUntranslated).toEqual(ErrorMessage.AboveMaxExponentialNotation);
  });
});
