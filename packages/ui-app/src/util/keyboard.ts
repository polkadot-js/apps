// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KEYS } from '../constants';
import isCopy from './keyboard/isCopy';

const regex = {
  decimalPoint: /[\.]/gi
};

// obtain current cursor index position of an input field
const cursorIndexInputField = (event: any) => event.target.value.slice(0, event.target.selectionStart).length;

const isNotDigit = (event: any): boolean => (event.keyCode < 48 || event.keyCode > 57);
const isNotDigitOnNumpad = (event: any): boolean => (event.keyCode < 96 || event.keyCode > 105);

const keydown = {
  // Reference: Degrade to keyCode for cross-browser compatibility https://www.w3schools.com/jsref/event_key_keycode.asp
  isCopy: (event: any, isPreKeyDown: boolean): boolean =>
    isCopy(event, isPreKeyDown),
  isCut: (event: any, isPreKeyDown: boolean): boolean => isPreKeyDown && (event.which || event.keyCode) === KEYS.X,
  isDuplicateDecimalPoint: (event: any): boolean => event.keyCode === KEYS.DECIMAL_POINT && event.target.value.match(regex.decimalPoint),
  isNonNumeric: (event: any): boolean => isNotDigit(event) && isNotDigitOnNumpad(event),
  isPaste: (event: any, isPreKeyDown: boolean): boolean => isPreKeyDown && event.which === KEYS.V,
  isSelectAll: (event: any, isPreKeyDown: boolean): boolean => isPreKeyDown && (event.which || event.keyCode) === KEYS.A,
  isShift: (event: any): boolean => event.shiftKey
};

export {
  cursorIndexInputField,
  keydown,
  regex
};
