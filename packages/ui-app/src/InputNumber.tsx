// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, BitLength, I18nProps } from './types';

import BN from 'bn.js';
import React from 'react';
import { formatBalance, calcSi } from '@polkadot/ui-app/util';
import { isUndefined } from '@polkadot/util';

import classes from './util/classes';
import { BitLengthOption } from './constants';
import Dropdown from './Dropdown';
import Input, { KEYS, KEYS_PRE, isCopy, isCut, isPaste, isSelectAll } from './Input';
import translate from './translate';

type Props = BareProps & I18nProps & {
  autoFocus?: boolean,
  bitLength?: BitLength,
  defaultValue?: BN | string,
  isDisabled?: boolean,
  isError?: boolean,
  isSi?: boolean,
  label?: any,
  maxLength?: number,
  onChange?: (value?: BN) => void,
  placeholder?: string,
  value?: BN | string,
  withLabel?: boolean
};

type State = {
  defaultValue?: string,
  isPreKeyDown: boolean,
  isValid: boolean,
  siOptions: Array<{ value: string, text: string }>,
  siUnit: string,
  valueBN: BN
};

const DEFAULT_BITLENGTH = BitLengthOption.NORMAL_NUMBERS as BitLength;
const KEYS_ALLOWED: Array<any> = [KEYS.ARROW_LEFT, KEYS.ARROW_RIGHT, KEYS.BACKSPACE, KEYS.ENTER, KEYS.ESCAPE, KEYS.TAB];

function maxConservativeLength (maxValueLength: number): number {
  const conservativenessFactor = 1;

  return maxValueLength - conservativenessFactor;
}

class InputNumber extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);

    const valueBN = new BN(this.props.value || 0);

    this.state = {
      defaultValue: this.props.defaultValue || !this.props.value
        ? undefined
        : valueBN.toString(),
      isPreKeyDown: false,
      isValid: !isUndefined(this.props.value),
      siOptions: formatBalance.getOptions().map(({ power, text, value }) => ({
        value,
        text: power === 0
          ? InputNumber.units
          : text
      })),
      siUnit: '-',
      valueBN
    };
  }

  static units: string = 'Unit';
  static setUnit (units: string = InputNumber.units): void {
    InputNumber.units = units;
  }

  static getDerivedStateFromProps ({ isDisabled, isSi, defaultValue = '0' }: Props): Partial<State> | null {
    if (!isDisabled || !isSi) {
      return null;
    }

    return {
      defaultValue: formatBalance(defaultValue, false),
      siUnit: calcSi(defaultValue.toString()).value
    };
  }

  render () {
    const { bitLength = DEFAULT_BITLENGTH, className, defaultValue = '0', isSi, isDisabled, maxLength, style, t } = this.props;
    const { isValid } = this.state;
    const maxValueLength = this.maxValue(bitLength).toString().length;
    const value = this.state.defaultValue || defaultValue;

    return (
      <Input
        {...this.props}
        className={classes('ui--InputNumber', className)}
        defaultValue={
          isDisabled
            ? undefined
            : value
        }
        isAction={isSi}
        isDisabled={isDisabled}
        isError={!isValid}
        maxLength={maxLength || maxConservativeLength(maxValueLength)}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        onKeyUp={this.onKeyUp}
        placeholder={t('Positive number')}
        style={style}
        value={
          isDisabled
            ? value
            : undefined
        }
        type='text'
      >
        {this.renderSiDropdown()}
      </Input>
    );
  }

  private renderSiDropdown () {
    const { isSi } = this.props;
    const { siOptions, siUnit } = this.state;

    if (!isSi) {
      return undefined;
    }

    return (
      <Dropdown
        isButton
        defaultValue={siUnit}
        onChange={this.selectSiUnit}
        options={siOptions}
      />
    );
  }

  private maxValue = (bitLength?: number): BN =>
    new BN(2).pow(new BN(bitLength || DEFAULT_BITLENGTH)).subn(1)

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

  private isValidNumber = (input: BN, bitLength: number = DEFAULT_BITLENGTH): boolean => {
    const maxBN = this.maxValue(bitLength);

    if (!input.lt(maxBN) || !this.isValidBitLength(input, bitLength)) {
      return false;
    }

    return true;
  }

  private onChange = (value: string): void => {
    const { bitLength, onChange } = this.props;
    const { siUnit } = this.state;

    try {
      const valueBN = this.applySi(siUnit, new BN(value || 0));
      const isValid = this.isValidNumber(valueBN, bitLength);

      this.setState({ isValid, valueBN });

      onChange && onChange(
        isValid
          ? valueBN
          : undefined
      );
    } catch (error) {
      console.error(error);
    }
  }

  private onKeyDown = (event: React.KeyboardEvent<Element>): void => {
    const { isPreKeyDown } = this.state;

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

  private applySi (siUnit: string, value: BN): BN {
    const { isSi } = this.props;

    if (!isSi) {
      return value;
    }

    const si = formatBalance.findSi(siUnit);
    const power = new BN(formatBalance.getDefaultDecimals() + si.power);

    return value.mul(new BN(10).pow(power));
  }

  private applyNewSi (oldSi: string, newSi: string, value: BN): BN {
    const si = formatBalance.findSi(oldSi);
    const power = new BN(formatBalance.getDefaultDecimals() + si.power);

    return this.applySi(newSi, value.div(new BN(10).pow(power)));
  }

  private selectSiUnit = (siUnit: string): void => {
    this.setState((prevState: State) => {
      const { bitLength, onChange } = this.props;
      const valueBN = this.applyNewSi(prevState.siUnit, siUnit, prevState.valueBN);
      const isValid = this.isValidNumber(valueBN, bitLength);

      onChange && onChange(
        isValid
          ? valueBN
          : undefined
      );

      return {
        isValid,
        siUnit,
        valueBN
      };
    });
  }
}

export {
  InputNumber,
  maxConservativeLength
};

export default translate(InputNumber);
