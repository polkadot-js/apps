// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import BN from 'bn.js';
import { IsValidWithMessage } from './types';
import scientificNotationToNumber from './scientificNotationToNumber';

// RegEx Pattern (positive int or scientific notation): http://regexlib.com/REDetails.aspx?regexp_id=330
const re = RegExp('^[0-9\e\+\.]+[0-9\e\+\.]*$');

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

  // remove all preceding zeros (i.e. since for example '001' to BN isn't same as '1' to BN)
  //
  // note: not required since already preventing user from entering preceding zeros
  input = input.replace(/\b0+/g, '');

  // given that it's a string, check it's non-scientific notation
  //
  // note: not required at the moment since we're only allowing numeric values on key down
  // TODO - check that only one instance of 'e+' combination before submit once we permit these values and convert
  // if (input.indexOf('e+') !== -1) {
  //   throw Error('Balance input value must not be in scientific notation');
  // }
  const matchE = input.match(/e/gi);
  const matchPlus = input.match(/\+/gi);
  const matchEPlus = input.match(/e\+/gi);

  const matchEBeforeNumberOrPlus = input.match(/(e)(?=[0-9+])/ig);
  const matchEPlusBeforeNumber = input.match(/(e\+)(?=[0-9])/ig);

  if (matchE && matchE.length > 1 || matchPlus && matchPlus.length > 1) {
    return { isValid: false, errorMessage: 'Scientific notation may only contain one instance of \'e\' for scientific notation or exponential with \'e+\'' };
  }

  if (matchEPlus && matchEPlus.length === 1 && !matchEPlusBeforeNumber) {
    return { isValid: false, errorMessage: 'Exponential \'e+\' notation when used must be followed by a number' };
  }

  if (matchE && matchE.length === 1 && !matchEBeforeNumberOrPlus) {
    return { isValid: false, errorMessage: 'Scientific notation \'e\' when used must be followed by a number' };
  }

  // check the string only contains integers digits or scientific notation
  if (!re.test(input)) {
    return { isValid: false, errorMessage: 'Balance to transfer in DOTs must be a number or expressed in scientific notation (i.e. 3.4e38) or exponential with \'e+\'' };
  }

  // check value is greater than zero, whether it be scientific notation, exponential (which allow decimal)
  if (isNaN(parseFloat(input)) || Number(parseFloat(input)) < 1) {
    return { isValid: false, errorMessage: 'Balance to transfer in DOTs must be greater than zero' };
  }

  // check value is not finite (infinite)
  if (!isFinite(parseFloat(input))) {
    return { isValid: false, errorMessage: 'Balance to transfer in DOTs must not be infinite' };
  }

  // if there is a full stop '.' (only allowed for scientific notation) but they have not yet entered an 'e', then generate error until 'e' provided
  if (input.indexOf('.') !== -1 && input.indexOf('e') === -1) {
    return { isValid: false, errorMessage: 'Decimals points are only allowed in scientific notation by using an \'e\' (i.e. 3.4e38) or exponential with \'e+\'' };
  }

  // chain specification 'latest' is 128 bit and supports below 2^128-1, which is ~3.40×10^38
  // and may be entered as 3.4e38, 3.4e+38 or 340282366920938463463374607431768211455
  const supportedBitLength = '128';
  // show is equilant to 340282366920938463463374607431768211455 by calling .toString(10)
  const maxBN128Bit = new BN('2').pow(new BN(supportedBitLength)).sub(new BN('1'));
  const inputBN = new BN(input);

  if (!inputBN.lt(maxBN128Bit)) {
    return { isValid: false, errorMessage: 'Balance exceeds maximum for 128 bit' };
  }

  if (input.indexOf('e') !== -1) {
    const inputConvertedFromScientificNotation = scientificNotationToNumber(input);
    const inputConvertedFromScientificNotationBN = new BN(inputConvertedFromScientificNotation);

    if (!inputConvertedFromScientificNotation) {
      throw Error('Unable to convert scientific or exponential notation to number');
    }

    if (matchEPlus && !inputConvertedFromScientificNotationBN.lt(maxBN128Bit)) {
      return { isValid: false, errorMessage: 'Balance value after converting from exponential notation exceeds maximum for 128 bit' };
    } else if (!inputConvertedFromScientificNotationBN.lt(maxBN128Bit)) {
      return { isValid: false, errorMessage: 'Balance value after converting from scientific notation exceeds maximum for 128 bit' };
    } else {
      return {
        isValid: true,
        infoMessage: inputConvertedFromScientificNotation,
        inputConvertedFromScientificNotation: inputConvertedFromScientificNotation
      };
    }
  }

  return {
    isValid: true,
    infoMessage: Number.parseFloat(input).toExponential(2)
  };
}
