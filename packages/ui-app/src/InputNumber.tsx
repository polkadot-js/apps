// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, BitLength, I18nProps } from './types';

import BN from 'bn.js';
import React from 'react';
import { formatBalance, isUndefined } from '@polkadot/util';

import { classes } from './util';
import { BitLengthOption } from './constants';
import Dropdown from './Dropdown';
import Input, { KEYS, KEYS_PRE } from './Input';
import translate from './translate';

type Props = BareProps & I18nProps & {
  autoFocus?: boolean,
  bitLength?: BitLength,
  defaultValue?: BN | string,
  help?: React.ReactNode,
  isDisabled?: boolean,
  isError?: boolean,
  isSi?: boolean,
  isDecimal?: boolean,
  label?: any,
  maxLength?: number,
  onChange?: (value?: BN) => void,
  placeholder?: string,
  value?: BN | string,
  withLabel?: boolean
};

type State = {
  isPreKeyDown: boolean,
  isValid: boolean,
  siOptions: Array<{ value: string, text: string }>,
  siUnit: string,
  value: string,
  valueBN: BN
};

const DEFAULT_BITLENGTH = BitLengthOption.NORMAL_NUMBERS as BitLength;

class InputNumber extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);

    const { defaultValue, isSi, value } = this.props;
    let valueBN = new BN(value || 0);
    const si = formatBalance.findSi('-');

    this.state = {
      value: isSi
        ? new BN(defaultValue || valueBN).div(new BN(10).pow(new BN(si.power))).toString()
        : (defaultValue || valueBN).toString(),
      isPreKeyDown: false,
      isValid: !isUndefined(value),
      siOptions: formatBalance.getOptions().map(({ power, text, value }) => ({
        value,
        text: power === 0
          ? InputNumber.units
          : text
      })),
      siUnit: si.value,
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
      value: formatBalance(defaultValue, false),
      siUnit: formatBalance.calcSi(defaultValue.toString(), formatBalance.getDefaults().decimals).value
    };
  }

  render () {
    const { bitLength = DEFAULT_BITLENGTH, className, help, isSi, isDisabled, maxLength, style, t } = this.props;
    const { isValid, value } = this.state;
    const maxValueLength = this.maxValue(bitLength).toString().length - 1;

    return (
      <Input
        {...this.props}
        className={classes('ui--InputNumber', className)}
        help={help}
        isAction={isSi}
        isDisabled={isDisabled}
        isError={!isValid}
        maxLength={maxLength || maxValueLength}
        onChange={this.onChange}
        onKeyDown={this.onKeyDown}
        onKeyUp={this.onKeyUp}
        onPaste={this.onPaste}
        placeholder={t('Positive number')}
        style={style}
        value={value}
        type='text'
      >
        {isSi && this.renderSiDropdown()}
      </Input>
    );
  }

  private renderSiDropdown () {
    const { siOptions, siUnit } = this.state;

    return (
      <Dropdown
        isButton
        defaultValue={siUnit}
        onChange={this.selectSiUnit}
        options={siOptions}
      />
    );
  }

  private maxValue (bitLength?: number): BN {
    return new BN(2).pow(new BN(bitLength || DEFAULT_BITLENGTH)).subn(1);
  }

  private isValidBitLength (value: BN, bitLength?: number): boolean {
    return value.bitLength() <= (bitLength || DEFAULT_BITLENGTH);
  }

  private isValidNumber (input: BN, bitLength: number = DEFAULT_BITLENGTH): boolean {
    const maxBN = this.maxValue(bitLength);
    if (input.lt(new BN(0)) || !input.lt(maxBN) || !this.isValidBitLength(input, bitLength)) {
      return false;
    }

    return true;
  }

  private regex = (): RegExp => {
    const { isDecimal, isSi } = this.props;
    return new RegExp(
      (isSi || isDecimal) ?
        `^(0|[1-9]\\d*)(\\${KEYS.DECIMAL}\\d*)?$` :
        `^(0|[1-9]\\d*)$`
    );
  }

  private onChange = (value: string): void => {
    const { bitLength, onChange } = this.props;
    const { siUnit } = this.state;

    try {
      const valueBN = this.inputValueToBn(value, siUnit);
      const isValid = this.isValidNumber(valueBN, bitLength);

      this.setState({ isValid, value, valueBN });

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
      return;
    }

    if (event.key.length === 1 && !isPreKeyDown) {
      const { selectionStart: i, selectionEnd: j, value } = event.target as HTMLInputElement;
      const newValue = `${
        value.substring(0, i!)
      }${
        event.key
      }${
        value.substring(j!)
      }`;

      if (!this.regex().test(newValue)) {
        event.preventDefault();
      }
    }
  }

  private onKeyUp = (event: React.KeyboardEvent<Element>): void => {
    if (KEYS_PRE.includes(event.key)) {
      this.setState({ isPreKeyDown: false });
    }
  }

  private onPaste = (event: React.ClipboardEvent<Element>): void => {
    const { value: newValue } = event.target as HTMLInputElement;

    if (!this.regex().test(newValue)) {
      event.preventDefault();
      return;
    }
  }

  private selectSiUnit = (siUnit: string): void => {
    this.setState((prevState: State) => {
      const { bitLength, onChange } = this.props;
      const isValid = this.isValidNumber(prevState.valueBN, bitLength);
      const value = this.bnToInputValue(prevState.valueBN, siUnit);

      onChange && onChange(
        isValid
          ? prevState.valueBN
          : undefined
      );

      return {
        isValid,
        siUnit,
        value
      };
    });
  }

  private inputValueToBn = (value: string, siUnit: string): BN => {
    const { isSi } = this.props;
    const basePower = isSi ? formatBalance.getDefaults().decimals : 0;
    const siPower = isSi ? formatBalance.findSi(siUnit).power : 0;

    const isDecimalValue = value.match(/^(\d+)\.(\d+)$/);

    if (isDecimalValue) {
      if (siPower - isDecimalValue[2].length < -basePower) {
        return new BN(-1);
      }

      const div = new BN(value.replace(/\.\d*$/, ''));
      const mod = new BN(value.replace(/^\d+\./, ''));

      return div
        .mul(new BN(10).pow(new BN(basePower + siPower)))
        .add(mod.mul(new BN(10).pow((new BN(basePower + siPower - mod.toString().length)))));
    } else {
      return new BN(value.replace(/[^\d]/g, ''))
        .mul(new BN(10).pow(new BN(basePower + siPower)));
    }
  }

  private bnToInputValue = (bn: BN, siUnit: string): string => {
    const { isSi } = this.props;

    const basePower = isSi ? formatBalance.getDefaults().decimals : 0;
    const siPower = isSi ? formatBalance.findSi(siUnit).power : 0;

    const base = new BN(10).pow(new BN(basePower + siPower));
    const zero = new BN(0);
    const div = bn.div(base);
    const mod = bn.mod(base);

    return `${
      div.gt(zero) ? div.toString() : '0'
    }${
      mod.gt(zero) ?
        (() => {
          const padding = Math.max(
            mod.toString().length,
            base.toString().length - div.toString().length,
            bn.toString().length - div.toString().length
          );
          return `.${mod.toString(10, padding).replace(/0*$/, '')}`;
        })() :
        ''
    }`;
  }
}

export {
  InputNumber
};

export default translate(InputNumber);
