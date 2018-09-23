// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps, BitLength, I18nProps } from './types';

import BN from 'bn.js';
import React from 'react';
import isString from '@polkadot/util/is/string';

import classes from './util/classes';
import { BitLengthOption } from './constants';
import Input, { KEYS, KEYS_PRE, isCopy, isCut, isPaste, isSelectAll } from './Input';
import translate from './translate';

type Props = BareProps & I18nProps & {
  bitLength?: BitLength,
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

const DEFAULT_BITLENGTH = BitLengthOption.NORMAL_NUMBERS as BitLength;
const KEYS_ALLOWED: Array<any> = [KEYS.ARROW_LEFT, KEYS.ARROW_RIGHT, KEYS.BACKSPACE, KEYS.ENTER, KEYS.ESCAPE, KEYS.TAB];

function maxConservativeLength (maxValueLength: number): number {
  const conservativenessFactor = 1;

  return maxValueLength - conservativenessFactor;
}

class InputNumber extends React.PureComponent<Props, State> {
  state: State = {
    isPreKeyDown: false,
    isValid: false,
    previousValue: '0'
  };

  render () {
    const { bitLength = DEFAULT_BITLENGTH, className, defaultValue, maxLength, style, t } = this.props;
    const { isValid, previousValue } = this.state;
    const revertedValue = !isValid ? previousValue : undefined;
    const maxValueLength = this.maxValue(bitLength).toString().length;

    return (
      <div
        className={classes('ui--InputNumber', className)}
        style={style}
      >
        <Input
          {...this.props}
          defaultValue={defaultValue || '0'}
          maxLength={maxLength || maxConservativeLength(maxValueLength)}
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
    new BN(2).pow(new BN(bitLength || DEFAULT_BITLENGTH)).subn(1)

  // check if string value is non-integer even if above MAX_SAFE_INTEGER. isNaN(Number(value)) is faster for values of length 1
  private isNonInteger = (value: string): boolean =>
    value && value.length && value.split('').find(value => '0123456789'.indexOf(value) === -1) ? true : false

  private isValidBitLength = (value: BN, bitLength?: number): boolean =>
    value.bitLength() <= (bitLength || DEFAULT_BITLENGTH)

  private isValidKey = (event: React.KeyboardEvent<Element>, isPreKeyDown: boolean): boolean => {
    const { value: previousValue } = event.target as HTMLInputElement;
    // prevents entry of zero if initial digit is zero
    const isDuplicateZero = previousValue[0] === '0' && event.key === KEYS.ZERO;

    if (isDuplicateZero) {
      return false;
    }

    // prevent use of shift key
    if (event.shiftKey) {
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

    if (isNaN(Number(event.key)) && !KEYS_ALLOWED.includes(event.key)) {
      return false;
    }

    return true;
  }

  private isValidNumber = (input: string, bitLength?: number): boolean => {
    const { t } = this.props;
    bitLength = bitLength || DEFAULT_BITLENGTH;

    // failsafe as expects only positive integers as permitted by onKeyDown from input of type text
    if (!isString(input)) {
      throw Error(t('inputnumber.error.string.required', {
        defaultValue: 'Number input value must be valid type'
      }));
    }

    // remove spaces even though not possible as user restricted from entering spacebar key in onKeyDown
    input = input.toLowerCase().split(' ').join('');

    if (this.isNonInteger(input)) {
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
    const { bitLength, onChange } = this.props;

    try {
      const valueBN = new BN(value || 0);
      const isValid = this.isValidNumber(value, bitLength);

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

  private onKeyUp = (event: React.KeyboardEvent<Element>): void => {
    const { value: newValue } = event.target as HTMLInputElement;
    const isNewValueZero = new BN(newValue).isZero();

    if (KEYS_PRE.includes(event.key)) {
      this.setState({ isPreKeyDown: false });
    }

    /* if new value equates to '0' in BN when but it's length is >=1 (i.e. '012', '00', etc)
     * then replace the input value with just '0'.
     * otherwise remove the preceding zeros from the new value (i.e. '0123' -> '123')
     * note: edge case glitch occurs if existing value is '0' and you 'hold down' and keep
     * pasting a value of '00' after it, then sometimes when you let go the
     * remaining value shown as '000' or '00000' in the UI, but it's still ok because
     * the actual BN if the user submitted would still be '0', and if they then press any key
     * the UI input value resets to '0'
     */
    if (isNewValueZero && newValue.length >= 1) {
      (event.target as HTMLInputElement).value = '0';
    } else {
      (event.target as HTMLInputElement).value = newValue.replace(/^0+/, '');
    }
  }
}

export {
  InputNumber,
  maxConservativeLength
};

export default translate(InputNumber);
