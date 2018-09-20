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

// chain specification bit length
const BIT_LENGTH_128 = 128;

// note: KeyboardEvent.keyCode and KeyboardEvent.which are deprecated
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
  ENTER: 'Enter',
  ESCAPE: 'Escape',
  TAB: 'Tab',
  V: 'v',
  X: 'x'
};

const KEYS_ALLOWED: Array<any> = [KEYS.ARROW_LEFT, KEYS.ARROW_RIGHT, KEYS.BACKSPACE, KEYS.DECIMAL_POINT, KEYS.ENTER, KEYS.ESCAPE, KEYS.TAB];

const KEYS_PRE: Array<any> = [KEYS.ALT, KEYS.CMD, KEYS.CTRL];

// reference: degrade key to keyCode for cross-browser compatibility https://www.w3schools.com/jsref/event_key_keycode.asp
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

class InputNumber extends React.PureComponent<Props, State> {
  state: State = {
    isPreKeyDown: false,
    isValid: false,
    previousValue: '0'
  };

  render () {
    const { className, defaultValue, maxLength, style, t } = this.props;
    const { isValid, previousValue } = this.state;
    const revertedValue = !isValid ? previousValue : undefined;

    return (
      <div
        className={classes('ui--InputNumber', className)}
        style={style}
      >
        <Input
          {...this.props}
          defaultValue={defaultValue || '0'}
          maxLength={maxLength || this.defaultMaxLength}
          onChange={this.onChange}
          onKeyDown={this.onKeyDown}
          onKeyUp={this.onKeyUp}
          placeholder={t('inputnumber.placeholder', {
            defaultValue: 'Positive number'
          })}
          type='text'
          value={revertedValue}
        />
      </div>
    );
  }

  private maxValue = (bitLength?: number): BN =>
    new BN(2).pow(new BN(bitLength || BIT_LENGTH_128)).subn(1)

  private maxLength = (maxValue: BN): number => {
    const conservativenessFactor = 1;

    return this.maxValue.toString().length - conservativenessFactor;
  }

  private defaultMaxLength = this.maxLength(this.maxValue());

  private isNonDecimal = (value: string): boolean =>
    value && value.length && value.split('').find(value => '.0123456789'.indexOf(value) === -1) ? true : false

  private isValidBitLength = (value: BN, bitLength?: number): boolean =>
    value.bitLength() <= (bitLength || BIT_LENGTH_128)

  private isValidKey = (event: React.KeyboardEvent<Element>, isPreKeyDown: boolean): boolean => {
    const { value: previousValue } = event.target as HTMLInputElement;

    // only allow one instance of a decimal point in a decimal number. prevent use of shift key
    if (isDuplicateDecimalPoint(event.key, previousValue) || event.shiftKey) {
      return false;
    }

    // allow cut/copy/paste combinations but not non-numeric letters (i.e. a, c, x, v) individually
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

  private isValidNumber = (input: string, bitLength?: number): boolean => {
    const { t } = this.props;
    bitLength = bitLength || BIT_LENGTH_128;

    // failsafe as expects only positive integers or decimals as permitted by onKeyDown from input of type text
    if (!isString(input)) {
      throw Error(t('inputnumber.error.string.required', {
        defaultValue: 'Number input value must be valid type'
      }));
    }

    // remove spaces even though not possible as user restricted from entering spacebar key in onKeyDown
    input = input.toLowerCase().split(' ').join('');

    if (this.isNonDecimal(input)) {
      return false;
    }

    // max is (2 ** 128 - 1) for bitLength of 128 bit
    const maxBN = this.maxValue(bitLength);
    const inputBN = new BN(input);

    if (!inputBN.lt(maxBN) || !this.isValidBitLength(inputBN, bitLength)) {
      return false;
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

  private onKeyDown = (event: React.KeyboardEvent<Element>): void => {
    const { isPreKeyDown } = this.state;
    const { value: previousValue } = event.target as HTMLInputElement;

    // store previous input field in state incase user pastes invalid value and we need to revert the input value
    this.setState({ previousValue });

    if (KEYS_PRE.includes(event.key)) {
      this.setState({ isPreKeyDown: true });
    }

    // restrict input of certain keys
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
