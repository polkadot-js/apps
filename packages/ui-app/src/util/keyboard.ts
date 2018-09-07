// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import isCopy from './keyboard/isCopy';
import isCut from './keyboard/isCut';
import isDuplicateDecimalPoint from './keyboard/isDuplicateDecimalPoint';
import isNonNumeric from './keyboard/isNonNumeric';
import isPaste from './keyboard/isPaste';
import isSelectAll from './keyboard/isSelectAll';
import isShift from './keyboard/isShift';

const keydown = {
  // Reference: Degrade to keyCode for cross-browser compatibility https://www.w3schools.com/jsref/event_key_keycode.asp
  isCopy: (event: any, isPreKeyDown: boolean): boolean =>
    isCopy(event, isPreKeyDown),
  isCut: (event: any, isPreKeyDown: boolean): boolean =>
    isCut(event, isPreKeyDown),
  isDuplicateDecimalPoint: (event: any): boolean =>
    isDuplicateDecimalPoint(event),
  isNonNumeric: (event: any): boolean =>
    isNonNumeric(event),
  isPaste: (event: any, isPreKeyDown: boolean): boolean =>
    isPaste(event, isPreKeyDown),
  isSelectAll: (event: any, isPreKeyDown: boolean): boolean =>
    isSelectAll(event, isPreKeyDown),
  isShift: (event: any): boolean =>
    isShift(event)
};

export {
  keydown
};
