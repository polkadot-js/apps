// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import BN from 'bn.js';
import { TranslationFunction } from 'i18next';

import isString from '@polkadot/util/is/string';

import { isValidBitLength, maxValue } from '../util/chainSpec';
import { BIT_LENGTH_128 } from '../constants';
import { IsValidWithMessage } from './types';

// RegEx Pattern (positive integers or decimal values)
const reZero = /[.]/gi;

// receives only positive integers and decimal point as permited by onKeyDown in InputNumber.
export default function isValidBalance (input: string, t: TranslationFunction, bitLength?: number): IsValidWithMessage {
  bitLength = bitLength || BIT_LENGTH_128;

  // always a string from <input type='text'> but leave as failsafe
  if (!isString(input)) {
    throw Error(t('balance.error.string.required', {
      defaultValue: 'Balance input value must be valid type'
    }));
  }

  // impossible if we have not set space as an allowed key but leave as failsafe
  input = input.toLowerCase().split(' ').join('');

  const maxBN = maxValue(bitLength);
  const inputBN = new BN(input);

  // if 128 bit then max is 340282366920938463463374607431768211455
  if (!inputBN.lt(maxBN) || !isValidBitLength(inputBN, bitLength)) {
    return {
      isValid: false,
      errorMessage: t('balance.error.above.max', {
        defaultValue: 'Balance above max bit-length for {{bitLength}} bit',
        replace: {
          bitLength
        }
      })
    };
  } else if (inputBN.isZero()) {
    return {
      isValid: true,
      warnMessage: t('balance.warn.zero', {
        defaultValue: 'Balance value of 0'
      })
    };
  }

  const maxSafeIntegerBN = new BN(Number.MAX_SAFE_INTEGER);

  if (inputBN.gt(maxSafeIntegerBN)) {
    return {
      isValid: false
    };
  }

  /* Use BN.js to generate approximate value in scientific notation without
   * using Number (i.e. `Number.parseFloat(input).toExponential(2)`).
   * Display an info message only if the input string does not contain decimal point
   */
  if (!input.match(reZero)) {
    const inputValue = inputBN.toString(10);
    const inputValueExponent = inputValue.length - 1;
    const infoMessage: string = `${inputValue.charAt(0)}e+${inputValueExponent}`;

    return {
      isValid: true,
      infoMessage
    };
  }

  return {
    isValid: true
  };
}
