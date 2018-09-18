// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { TranslationFunction } from 'i18next';

import BN from 'bn.js';

import isNonInteger from './isNonInteger';

// RegEx Pattern (decimal values)
const reZero = /[.]/gi;

/* Receives only positive integers and decimal point as permited by onKeyDown in InputNumber.
 * Use BN.js to generate approximate value in scientific notation without
 * using Number (i.e. `Number.parseFloat(input).toExponential(2)`).
 * Display an info message only if the input string does not contain decimal point
 */
export default function toScientificNotation (input: string, t: TranslationFunction): string | undefined {
  if (input.match(reZero) || isNonInteger(input)) {
    return;
  }

  const inputValue = new BN(input).toString(10);
  const infoMessage: string = t('number.info.scientific', {
    defaultValue: '{{prefix}}{{symbol}}{{exponent}}',
    replace: {
      prefix: inputValue.charAt(0),
      symbol: 'e+',
      exponent: inputValue.length - 1
    }
  });

  return infoMessage;
}
