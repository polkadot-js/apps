// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KEYS } from '../constants';

const regex = {
  e: /[e]/gi,
  plus: /[\+]/gi,
  decimalPoint: /[\.]/gi
};

// obtain current cursor index position of an input field
const cursorIndexInputField = (event: any) => event.target.value.slice(0, event.target.selectionStart).length;

const isNotDigit = (event: any): boolean => (event.keyCode < 48 || event.keyCode > 57);
const isNotDigitOnNumpad = (event: any): boolean => (event.keyCode < 96 || event.keyCode > 105);

const keydown = {
  // Reference: Degrade to keyCode for cross-browser compatibility https://www.w3schools.com/jsref/event_key_keycode.asp
  isCopy: (event: any, isPreKeyDown: boolean): boolean => isPreKeyDown && (event.which || event.keyCode) === KEYS.C,
  isCut: (event: any, isPreKeyDown: boolean): boolean => isPreKeyDown && (event.which || event.keyCode) === KEYS.X,
  isDuplicateE: (event: any): boolean => event.keyCode === KEYS.E && event.target.value.match(regex.e),
  isDuplicatePlus: (event: any): boolean => event.keyCode === KEYS.PLUS && event.target.value.match(regex.plus),
  isDuplicateDecimalPoint: (event: any): boolean => event.keyCode === KEYS.DECIMAL_POINT && event.target.value.match(regex.decimalPoint),
  isNotEBeforePlus: (event: any): boolean => event.keyCode === KEYS.PLUS && event.target.value.charAt(cursorIndexInputField(event) - 1) !== 'e',
  isNonNumeric: (event: any): boolean => isNotDigit(event) && isNotDigitOnNumpad(event),
  isPaste: (event: any, isPreKeyDown: boolean): boolean => isPreKeyDown && event.which === KEYS.V,
  isPlus: (event: any): boolean => event.shiftKey && (event.which || event.keyCode) === KEYS.PLUS,
  isSelectAll: (event: any, isPreKeyDown: boolean): boolean => isPreKeyDown && (event.which || event.keyCode) === KEYS.A,
  isZeroAtInitCursorIndex: (event: any): boolean => (event.keyCode === KEYS.ZERO || event.keyCode === KEYS.ZERO_NUMPAD) && event.target.value.charAt(0)
};

const keyup = {
  isExistE: (event: any): boolean => event.target.value.match(regex.e)
};

export {
  cursorIndexInputField,
  keydown,
  keyup,
  regex
};
