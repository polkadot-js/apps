// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { TranslationFunction } from 'i18next';
import { IsValidWithMessage } from './types';

import BN from 'bn.js';
import isString from '@polkadot/util/is/string';

import { isValidBitLength, maxValue } from '../util/chainSpec';
import { BIT_LENGTH_128 } from '../constants';
import isNonDecimal from './isNonDecimal';
import toScientificNotation from './toScientificNotation';

/* Receives only positive integers and decimal point as permited by onKeyDown in InputNumber.
 * Receives `input` value that is always a string from <input type='text'> but check type as failsafe.
 * Converts `input` to lowercase and strips spaces even though not be possible since user restricted from entering spacebar key.
 * Prevent input of non-decimal values (allow numeric including from keyboards with numpad).
 * Note: If bitLength provided is 128 bit then max is (2 ** 128 - 1), i.e. 340282366920938463463374607431768211455
 */
export default function isValidNumber (input: string, t: TranslationFunction, bitLength?: number): IsValidWithMessage {
  bitLength = bitLength || BIT_LENGTH_128;

  if (!isString(input)) {
    throw Error(t('number.error.string.required', {
      defaultValue: 'Number input value must be valid type'
    }));
  }

  input = input.toLowerCase().split(' ').join('');

  if (isNonDecimal(input)) {
    return {
      isValid: false
    };
  }

  const maxBN = maxValue(bitLength);
  const inputBN = new BN(input);
  const maxSafeIntegerBN = new BN(Number.MAX_SAFE_INTEGER);

  if (!inputBN.lt(maxBN) || !isValidBitLength(inputBN, bitLength)) {
    return {
      isValid: false
    };
  } else if (inputBN.isZero()) {
    return {
      isValid: true,
      warnMessage: t('number.warn.zero', {
        defaultValue: 'Number value of 0'
      })
    };
  }

  if (inputBN.gt(maxSafeIntegerBN)) {
    return {
      isValid: true,
      infoMessage: toScientificNotation(input, t)
    };
  }

  return {
    isValid: true,
    infoMessage: toScientificNotation(input, t)
  };
}
