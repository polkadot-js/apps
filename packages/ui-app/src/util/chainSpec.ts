// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import BN from 'bn.js';

import { BIT_LENGTH_128 } from '../constants';

/* chain specification 'latest' is 128 bit and supports max value of 2^128-1, which is ~3.40×10^38
 * and may be entered as 3.4e38, 3.4e+38 or 340282366920938463463374607431768211455. we may
 * show it is equivalent to 340282366920938463463374607431768211455 by calling .toString(10)
 */
const maxValue = (bitLength?: number): BN => new BN(2).pow(new BN(bitLength || BIT_LENGTH_128)).subn(1);

const maxLength = (maxValue: BN): number => maxValue.toString().length; // returns 39 for 128 bit arg

const defaultMaxLength = maxLength(maxValue());

// fixes error when enter value like 0.1111111111111111111111111111111, which causes
// bn.js error in toU8a.js of 'byte array longer than desired length'
const checkValueBitLength = (value: BN, bitLength?: number): boolean => {
  return value.bitLength() <= (bitLength || BIT_LENGTH_128) ? true : false;
};

export {
  defaultMaxLength,
  checkValueBitLength,
  maxValue,
  maxLength
};
