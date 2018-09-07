// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import BN from 'bn.js';
import { TranslationFunction } from 'i18next';

import isString from '@polkadot/util/is/string';

import { isValidBitLength, maxValue } from '../util/chainSpec';
import { BIT_LENGTH_128, MAX_SAFE_INTEGER } from '../constants';
import { IsValidWithMessage } from './types';

// RegEx Pattern (positive integers or decimal values)
const reValidInputChars = RegExp('^[0-9\.]+[0-9\.]*$');

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

  // check the string only contains integers or decimals
  if (!reValidInputChars.test(input)) {
    return {
      isValid: false,
      errorMessage: t('balance.error.format', {
        defaultValue: 'Balance to transfer in DOTs must be a positive number'
      })
    };
  }

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
        defaultValue: 'Balance to transfer 0 DOTs'
      })
    };
  }

  const infoMessage: string | undefined = Number(input) <= MAX_SAFE_INTEGER ? Number.parseFloat(input).toExponential(2) : undefined;

  return {
    isValid: true,
    infoMessage
  };
}
