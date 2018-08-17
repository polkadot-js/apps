// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import BN from 'bn.js';
import { IsValidWithMessage } from './types';

// RegEx Pattern (positive int): http://regexlib.com/REDetails.aspx?regexp_id=330
const re = RegExp('^[0-9]+[0-9]*$');

export default function isValidBalance (input: any): IsValidWithMessage {
  console.log('input: ', input);
  // check it's a string
  //
  // note: always a string from <input type='number'>
  if (!(typeof input === 'string')) {
    throw Error('Balance input value must be of string type');
  }

  // input passed in is a string and already trimmed of whitespace
  // but do it again incase pass in value that hasn't been prepared
  //
  // note: impossible since usng <input type='number'> and prevents spaces
  input = input.toLowerCase().split(' ').join('');

  // given that it's a string, check it's non-exponential
  if (input.indexOf('e+') !== -1) {
    throw Error('Balance input value must not be in scientific notation');
  }

  // check the string only contains integers digits
  if (!re.test(input)) {
    return { isValid: false, errorMessage: 'Balance to transfer in DOTs must be a number' };
  }

  // remove all preceding zeros (i.e. since '01' to BN isn't same as '1' to BN)
  input = input.replace(/\b0+/g, '');

  // check value is a number and greater than zero
  if (!isNaN(parseInt(input, 10)) || Number(parseInt(input, 10)) < 1) {
    return { isValid: false, errorMessage: 'Balance to transfer in DOTs must be greater than zero' };
  }

// check that only one instance of 'e+' combination before submit

  // chain specification 'latest' (128 bit)
  const max128Bit = '340282366920938463463374607431768211455';
  const maxBN128Bit = new BN(max128Bit);
  const inputBN = new BN(input);

  if (!inputBN.lte(maxBN128Bit)) {
    return { isValid: false, errorMessage: 'Balance exceeds maximum for 128 bit' };
  }

  return { isValid: true };
}
