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
  CMD: (event: any): void => event.metaKey, // firefox (91), safari (224)
  CTRL: 17,
  DECIMAL_POINT: 190, // decimals allowed for scientific or exponential notation
  DEL: 8,
  ESCAPE: 27,
  ENTER: 13,
  PLUS: 187, // '+'
  TAB: 9, // next input field
  A: 65, // select all from balance input
  C: 67, // copy balance
  E: 69, // scientific or exponential notation
  V: 86, // paste balance
  X: 88, // cut balance
  ZERO: 48,
  ZERO_NUMPAD: 96
};

const KEYS_ALLOWED: Array<any> = [KEYS.ALT, KEYS.ARROW_LEFT, KEYS.ARROW_RIGHT, KEYS.BACKSPACE, KEYS.CMD, KEYS.CTRL, KEYS.DECIMAL_POINT, KEYS.DEL, KEYS.E, KEYS.ESCAPE, KEYS.ENTER, KEYS.TAB, KEYS.ZERO, KEYS.ZERO_NUMPAD];

export {
  BIT_LENGTH_128,
  KEYS,
  KEYS_ALLOWED
};
