// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import BN from 'bn.js';
import { IsValidWithMessage } from './types';
import scientificNotationToNumber from './scientificNotationToNumber';

// RegEx Pattern (positive int or scientific notation): http://regexlib.com/REDetails.aspx?regexp_id=330
const re = RegExp('^[0-9\e\+]+[0-9\e\+]*$');

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

  // given that it's a string, check it's non-scientific notation
  //
  // note: not required at the moment since we're only allowing numeric values on key down
  // TODO - check that only one instance of 'e+' combination before submit once we permit these values and convert
  // if (input.indexOf('e+') !== -1) {
  //   throw Error('Balance input value must not be in scientific notation');
  // }
  const matchE = input.match(/e/gi);
  const matchPlus = input.match(/\+/gi);

  if (matchE && matchE.length > 1 || matchPlus && matchPlus.length > 1) {
    return { isValid: false, errorMessage: 'Scientific notation may only contain one instance of e+' };
  }

  // check the string only contains integers digits or scientific notation
  if (!re.test(input)) {
    return { isValid: false, errorMessage: 'Balance to transfer in DOTs must be a number or expressed in scientific notation' };
  }

  // remove all preceding zeros (i.e. since for example '001' to BN isn't same as '1' to BN)
  //
  // note: not required since already preventing user from entering preceding zeros
  input = input.replace(/\b0+/g, '');

  // check value is a number and greater than zero
  //
  // note: not required since input only allows numeric values but no decimals, negatives, or zero
  if (isNaN(parseInt(input, 10)) || Number(parseInt(input, 10)) < 1) {
    return { isValid: false, errorMessage: 'Balance to transfer in DOTs must be greater than zero' };
  }

  // chain specification 'latest' (128 bit)
  const max128Bit = '340282366920938463463374607431768211455';
  const maxBN128Bit = new BN(max128Bit);
  const inputBN = new BN(input);

  if (!inputBN.lt(maxBN128Bit)) {
    return { isValid: false, errorMessage: 'Balance exceeds maximum for 128 bit' };
  }

  if (input.indexOf('e') !== -1) {
    console.log('doing info message');
    const inputConvertedFromScientificNotation = scientificNotationToNumber(input);
    const inputConvertedFromScientificNotationBN = new BN(inputConvertedFromScientificNotation);

    if (!inputConvertedFromScientificNotation) {
      throw Error('Unable to convert scientific notation to number');
    }

    if (!inputConvertedFromScientificNotationBN.lt(maxBN128Bit)) {
      return { isValid: false, errorMessage: 'Balance value after converting from scientific notation exceeds maximum for 128 bit' };
    } else {
      return {
        isValid: true,
        infoMessage: `Equivalent: ${inputConvertedFromScientificNotation}`,
        inputConvertedFromScientificNotation: inputConvertedFromScientificNotation
      };
    }
  }

  return { isValid: true };
}
