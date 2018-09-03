// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

// chain specification bit length
const BIT_LENGTH_128 = 128;

const KEYS = {
  ALT: 18,
  ARROW_LEFT: 37,
  ARROW_RIGHT: 39,
  BACKSPACE: 46,
  isCMD: (event: any): void => event.metaKey,
  CMD: 91, // || 224, // firefox (91), safari (224)
  CTRL: 17,
  DECIMAL_POINT: 190, // decimals
  DEL: 8,
  ESCAPE: 27,
  ENTER: 13,
  PLUS: 187, // '+'
  SHIFT: 16,
  TAB: 9, // next input field
  A: 65, // select all from balance input
  C: 67, // copy balance
  E: 69, // scientific or exponential notation
  V: 86, // paste balance
  X: 88, // cut balance
  ZERO: 48,
  ZERO_NUMPAD: 96
};

const KEYS_ALLOWED: Array<any> = [KEYS.ARROW_LEFT, KEYS.ARROW_RIGHT, KEYS.BACKSPACE, KEYS.DECIMAL_POINT, KEYS.DEL, KEYS.ESCAPE, KEYS.ENTER, KEYS.TAB, KEYS.ZERO, KEYS.ZERO_NUMPAD];

const KEYS_PRE: Array<any> = [KEYS.ALT, KEYS.CMD, KEYS.CTRL];

const MAX_SAFE_INTEGER: number = 9007199254740991; // 2**53-1

export {
  BIT_LENGTH_128,
  KEYS,
  KEYS_ALLOWED,
  KEYS_PRE,
  MAX_SAFE_INTEGER
};
