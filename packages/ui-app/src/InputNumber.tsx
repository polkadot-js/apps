// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps, I18nProps } from './types';

import BN from 'bn.js';
import React from 'react';
import isString from '@polkadot/util/is/string';

import classes from './util/classes';
import Input from './Input';
import translate from './translate';

type Props = BareProps & I18nProps & {
  defaultValue?: string,
  isError?: boolean,
  label?: any,
  maxLength?: number,
  onChange: (value: BN) => void,
  placeholder?: string,
  withLabel?: boolean
};

type State = {
  isPreKeyDown: boolean,
  isValid: boolean,
  previousValue: string
};

// Chain specification bit length
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

const KEYS_ALLOWED: Array<any> = [KEYS.ARROW_LEFT, KEYS.ARROW_RIGHT, KEYS.BACKSPACE, KEYS.DECIMAL_POINT, KEYS.ENTER, KEYS.ESCAPE, KEYS.TAB];

const KEYS_PRE: Array<any> = [KEYS.ALT, KEYS.CMD, KEYS.CTRL];

// Reference: Degrade to keyCode for cross-browser compatibility https://www.w3schools.com/jsref/event_key_keycode.asp
const isCopy = (key: string, isPreKeyDown: boolean): boolean =>
  isPreKeyDown && key === KEYS.C;

const isCut = (key: string, isPreKeyDown: boolean): boolean =>
  isPreKeyDown && key === KEYS.X;

const regexDecimalPoint = /[\.]/gi;

const isDuplicateDecimalPoint = (key: string, value: string): boolean => {
  const inputValue: string = value;
  const didPressDecimalPoint: boolean = key === KEYS.DECIMAL_POINT;
  const foundExistingDecimalPoint: boolean = inputValue.match(regexDecimalPoint) ? true : false;

  return didPressDecimalPoint && foundExistingDecimalPoint;
};

const isPaste = (key: string, isPreKeyDown: boolean): boolean =>
  isPreKeyDown && key === KEYS.V;

const isSelectAll = (key: string, isPreKeyDown: boolean): boolean =>
  isPreKeyDown && key === KEYS.A;

const isShift = (shiftKey: boolean): boolean =>
  shiftKey;

class InputNumber extends React.PureComponent<Props, State> {
  state: State = {
    isPreKeyDown: false,
    isValid: false,
    previousValue: '0'
  };

  render () {
    const { className, defaultValue, isError, label, maxLength, style, t, withLabel } = this.props;
    const { isValid, previousValue } = this.state;
    const shouldRevertValue = !isValid;
    const revertedValue = shouldRevertValue ? previousValue : undefined;

    return (
      <div
        className={classes('ui--InputNumber', className)}
        style={style}
      >
        <Input
          className={className}
          defaultValue={defaultValue || '0'}
          isError={isError}
          label={label}
          maxLength={maxLength || this.defaultMaxLength}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          onKeyUp={this.onKeyUp}
          placeholder={t('inputnumber.placeholder', {
            defaultValue: 'Positive number'
          })}
          style={style}
          type='text'
          value={revertedValue}
          withLabel={withLabel}
        />
      </div>
    );
  }

  private maxValue = (bitLength?: number): BN =>
    new BN(2).pow(new BN(bitLength || BIT_LENGTH_128)).subn(1)

  private maxLength = (maxValue: BN): number => {
    const conservativenessFactor = 1;

    return this.maxValue.toString().length - conservativenessFactor; // returns 38 for 128 bit
  }

  private defaultMaxLength = this.maxLength(this.maxValue());

  // Check if all characters in given string are decimal (without parsing number values)
  private isNonDecimal = (value: string): boolean => {
    const chars = '.0123456789';

    if (value.length === 1) {
      return chars.indexOf(value) === -1;
    } else {
      for (let el of value) {
        if (chars.indexOf(el) === -1) {
          return true;
        }
      }
    }
    return false;
  }

  private isValidBitLength = (value: BN, bitLength?: number): boolean =>
    value.bitLength() <= (bitLength || BIT_LENGTH_128)

  /* Only allows user balance input to contain one instance of '.' for decimals.
   * Prevents use of shift key.
   * Allow users to use cut/copy/paste combinations, but not non-numeric letters (i.e. a, c, x, v) individually
   */
  private isValidKey = (event: React.KeyboardEvent<Element>, isPreKeyDown: boolean): boolean => {
    const { value: previousValue } = event.target as HTMLInputElement;

    if (
      (isDuplicateDecimalPoint(event.key, previousValue)) ||
      (isShift(event.shiftKey))
    ) {
      return false;
    }

    if (
      (isSelectAll(event.key, isPreKeyDown)) ||
      (isCut(event.key, isPreKeyDown)) ||
      (isCopy(event.key, isPreKeyDown)) ||
      (isPaste(event.key, isPreKeyDown))
    ) {
      return true;
    }

    if (this.isNonDecimal(event.key) && !KEYS_ALLOWED.includes(event.key)) {
      return false;
    }

    return true;
  }

  /* Receives only positive integers and decimal point as permited by onKeyDown in InputNumber.
   * Receives `input` value that is always a string from <input type='text'> but check type as failsafe.
   * Converts `input` to lowercase and strips spaces even though not be possible since user restricted from entering spacebar key.
   * Note: If bitLength provided is 128 bit then max is (2 ** 128 - 1), i.e. 340282366920938463463374607431768211455
   */
  private isValidNumber = (input: string, bitLength?: number): boolean => {
    const { t } = this.props;
    bitLength = bitLength || BIT_LENGTH_128;

    if (!isString(input)) {
      throw Error(t('inputnumber.error.string.required', {
        defaultValue: 'Number input value must be valid type'
      }));
    }

    input = input.toLowerCase().split(' ').join('');

    if (this.isNonDecimal(input)) {
      return false;
    }

    const maxBN = this.maxValue(bitLength);
    const inputBN = new BN(input);
    const maxSafeIntegerBN = new BN(Number.MAX_SAFE_INTEGER);

    if (!inputBN.lt(maxBN) || !this.isValidBitLength(inputBN, bitLength)) {
      return false;
    } else if (inputBN.isZero()) {
      return true;
    }

    if (inputBN.gt(maxSafeIntegerBN)) {
      return true;
    }

    return true;
  }

  private onChange = (value: string): void => {
    const { onChange } = this.props;

    try {
      const valueBN = new BN(value || 0);
      const isValid = this.isValidNumber(value);

      this.setState({ isValid });

      if (!onChange || !isValid) {
        return;
      }

      onChange(valueBN);
    } catch (error) {
      console.error(error);
    }
  }

  /* KeyDown used since it can restrict input of certain keys. Its value is the previous input
   * field value before the new character entered. Previous input field value is stored in state
   * incase the user pastes an invalid value and we need to revert the input value.
   */
  private onKeyDown = (event: React.KeyboardEvent<Element>): void => {
    const { isPreKeyDown } = this.state;
    const { value: previousValue } = event.target as HTMLInputElement;

    this.setState({ previousValue });

    if (KEYS_PRE.includes(event.key)) {
      this.setState({ isPreKeyDown: true });
    }

    const isValid = this.isValidKey(event, isPreKeyDown);

    if (!isValid) {
      event.preventDefault();
    }
  }

  private onKeyUp = (key: string): void => {
    if (KEYS_PRE.includes(key)) {
      this.setState({ isPreKeyDown: false });
    }
  }
}

export {
  BIT_LENGTH_128,
  InputNumber
};

export default translate(InputNumber);
