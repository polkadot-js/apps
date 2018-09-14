// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import BN from 'bn.js';

import { BIT_LENGTH_128 } from '../constants';

// fixes error when enter value like 0.1111111111111111111111111111111, which causes
// bn.js error in toU8a.js of 'byte array longer than desired length'
const isValidBitLength = (value: BN, bitLength?: number): boolean =>
  value.bitLength() <= (bitLength || BIT_LENGTH_128);

/* chain specification 'latest' is 128 bit and supports max value of 2^128-1, which is ~3.40×10^38
 * and may be entered as 3.4e38, 3.4e+38 or 340282366920938463463374607431768211455. we may
 * show it is equivalent to 340282366920938463463374607431768211455 by calling .toString(10)
 */
const maxValue = (bitLength?: number): BN =>
  new BN(2).pow(new BN(bitLength || BIT_LENGTH_128)).subn(1);

/* max length in digits the user may enter in input field is reduced by conservativeness factor.
 * i.e. 16 bit largest allowable number in decimal is 2**16-1 (65535) having 5 digits.
 * if user is allowed to enter 5 digits and they enter >65535 then an error notification appears.
 * but we only allow user to enter 4 digits (i.e. max 9999) when conservativeness factor is set to 1,
 * so with the conservativeness factor set they are should not encounter the error notification.
 */
const maxLength = (maxValue: BN): number => {
  const conservativenessFactor = 1;

  return maxValue.toString().length - conservativenessFactor; // returns 38 for 128 bit arg
};

const defaultMaxLength = maxLength(maxValue());

export {
  defaultMaxLength,
  isValidBitLength,
  maxLength,
  maxValue
};
