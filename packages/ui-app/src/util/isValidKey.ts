// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { TranslationFunction } from 'i18next';
import { IsValidWithMessage } from './types';

import { KEYS_ALLOWED } from '../constants';
import { keydown } from './keyboard';
import isNonDecimal from './isNonDecimal';

/* Only allows user balance input to contain one instance of '.' for decimals.
 * Prevents use of shift key.
 * Allow users to use cut/copy/paste combinations, but not non-numeric letters (i.e. a, c, x, v) individually
 */
export default function isValidKey (event: React.KeyboardEvent<Element>, isPreKeyDown: boolean, t: TranslationFunction): IsValidWithMessage {
  const { value: previousValue } = event.target as HTMLInputElement;

  if (
    (keydown.isDuplicateDecimalPoint(event.key, previousValue)) ||
    (keydown.isShift(event.shiftKey))
  ) {
    return {
      isValid: false
    };
  }

  if (
    (keydown.isSelectAll(event.key, isPreKeyDown)) ||
    (keydown.isCut(event.key, isPreKeyDown)) ||
    (keydown.isCopy(event.key, isPreKeyDown)) ||
    (keydown.isPaste(event.key, isPreKeyDown))
  ) {
    return {
      isValid: true
    };
  }

  if (isNonDecimal(event.key) && !KEYS_ALLOWED.includes(event.key)) {
    return {
      isValid: false
    };
  }

  return {
    isValid: true
  };
}
