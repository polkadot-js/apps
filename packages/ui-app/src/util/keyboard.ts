// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import isCopy from './keyboard/isCopy';
import isCut from './keyboard/isCut';
import isDuplicateDecimalPoint from './keyboard/isDuplicateDecimalPoint';
import isPaste from './keyboard/isPaste';
import isSelectAll from './keyboard/isSelectAll';
import isShift from './keyboard/isShift';

const keydown = {
  // Reference: Degrade to keyCode for cross-browser compatibility https://www.w3schools.com/jsref/event_key_keycode.asp
  isCopy: (key: string, isPreKeyDown: boolean): boolean =>
    isCopy(key, isPreKeyDown),
  isCut: (key: string, isPreKeyDown: boolean): boolean =>
    isCut(key, isPreKeyDown),
  isDuplicateDecimalPoint: (key: string, value: string): boolean =>
    isDuplicateDecimalPoint(key, value),
  isPaste: (key: string, isPreKeyDown: boolean): boolean =>
    isPaste(key, isPreKeyDown),
  isSelectAll: (key: string, isPreKeyDown: boolean): boolean =>
    isSelectAll(key, isPreKeyDown),
  isShift: (shiftKey: boolean): boolean =>
    isShift(shiftKey)
};

export {
  keydown
};
