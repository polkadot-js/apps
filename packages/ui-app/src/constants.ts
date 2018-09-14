// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

// chain specification bit length
const BIT_LENGTH_128 = 128;

// Note: KeyboardEvent.keyCode and KeyboardEvent.which are deprecated
const KEYS = {
  A: 'a',
  ALT: 'Alt',
  ARROW_LEFT: 'ArrowLeft',
  ARROW_RIGHT: 'ArrowRight',
  BACKSPACE: 'Backspace',
  C: 'c',
  CMD: 'Meta',
  CTRL: 'Control',
  DECIMAL_POINT: '.',
  E: 'e',
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  PLUS: '+',
  SHIFT: 'Shift',
  TAB: 'Tab',
  V: 'v',
  X: 'x',
  ZERO: '0'
};

const KEYS_ALLOWED: Array<any> = [KEYS.ARROW_LEFT, KEYS.ARROW_RIGHT, KEYS.BACKSPACE, KEYS.DECIMAL_POINT, KEYS.BACKSPACE, KEYS.ESCAPE, KEYS.ENTER, KEYS.TAB, KEYS.ZERO];

const KEYS_PRE: Array<any> = [KEYS.ALT, KEYS.CMD, KEYS.CTRL];

export {
  BIT_LENGTH_128,
  KEYS,
  KEYS_ALLOWED,
  KEYS_PRE
};
