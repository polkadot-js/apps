// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';

import { decimalToFixedWidth } from '@polkadot/react-components/util';
import { formatBalance, formatNumber } from '@polkadot/util';
import { SiDef } from '@polkadot/util/types';

import { BitLengthOption } from './constants';
import Input, { KEYS, KEYS_PRE } from './Input';
import { useTranslation } from './translate';
import { BareProps, BitLength } from './types';
import { classes } from './util';

interface Props extends BareProps {
  autoFocus?: boolean;
  bitLength?: BitLength;
  defaultValue?: BN | string;
  help?: React.ReactNode;
  isDisabled?: boolean;
  isError?: boolean;
  isFull?: boolean;
  isSi?: boolean;
  isDecimal?: boolean;
  isZeroable?: boolean;
  label?: React.ReactNode;
  labelExtra?: React.ReactNode;
  maxLength?: number;
  maxValue?: BN;
  onChange?: (value?: BN) => void;
  onEnter?: () => void;
  onEscape?: () => void;
  placeholder?: string;
  value?: BN | string;
  withEllipsis?: boolean;
  withLabel?: boolean;
  withMax?: boolean;
}

const DEFAULT_BITLENGTH = BitLengthOption.NORMAL_NUMBERS as BitLength;
const ZERO = new BN(0);
const TEN = new BN(10);

export class TokenUnit {
  public static abbr = 'Unit';

  public static setAbbr (abbr: string = TokenUnit.abbr): void {
    TokenUnit.abbr = abbr;
  }
}

function getGlobalMaxValue (bitLength?: number): BN {
  return new BN(2).pow(new BN(bitLength || DEFAULT_BITLENGTH)).subn(1);
}

function getRegex (isDecimal: boolean): RegExp {
  return new RegExp(
    isDecimal
      ? `^([0-9]\\d*)(\\${KEYS.DECIMAL}\\d*)?$`
      : '^([0-9]\\d*)$'
  );
}

function isValidNumber (bn: BN, { bitLength = DEFAULT_BITLENGTH, isZeroable, maxValue }: Props): boolean {
  if (
    // cannot be negative
    bn.lt(ZERO) ||
    // cannot be > than allowed max
    !bn.lt(getGlobalMaxValue(bitLength)) ||
    // check if 0 and it should be a value
    (!isZeroable && bn.eq(ZERO)) ||
    // check that the bitlengths fit
    bn.bitLength() > (bitLength || DEFAULT_BITLENGTH) ||
    // cannot be > max (if specified)
    (maxValue && maxValue.gtn(0) && bn.gt(maxValue))
  ) {
    return false;
  }

  return true;
}

// Format user input into the current number input.
// This is setup to invoke on every keystroke.
const regexCheckFormatted = RegExp('^\\d{1,3}(,\\d{3})*(\\.\\d+)?$');
const regexCheckZero = RegExp('^(0\\d)');
export function formatInput (value: string) {
  let formattedValue = value;
  // Sometimes the value is already formatted, avoid formatting in those cases
  // Format only if required
  if (value && !regexCheckFormatted.exec(value)) {
    if (value.includes('.')) {
      let [prefix, postfix] = value.split('.');
      formattedValue = `${formatNumber(new BN(prefix))}.${postfix}`;
    } else {
      formattedValue = formatNumber(new BN(value));
    }
  }

  // Remove a leading 0 e.g `01` -> `1`
  formattedValue = regexCheckZero.exec(value) ? value.substr(1) : formattedValue;

  return formattedValue;
}

function getValuesFromString (value: string, props: Props): [string, BN, boolean] {
  // sanitize the user input value, keeping digits and decimal point only.
  const valueSanitized = value.replace(/[^\d|\.]/g, '');
  const valueFormatted = formatInput(valueSanitized);

  const valueBn = new BN(
    decimalToFixedWidth({
      value: valueSanitized,
      fixedPoint: formatBalance.getDefaults().decimals
    })
  );

  return [
    valueFormatted,
    valueBn,
    isValidNumber(valueBn, props)
  ];
}

function getValuesFromBn (valueBn: BN, si: SiDef | null): [string, BN, boolean] {
  const value = si
    ? valueBn.div(TEN.pow(new BN(si.power))).toString()
    : valueBn.toString();

  return [
    value,
    valueBn,
    true
  ];
}

function getValues (value: BN | string, si: SiDef | null, props: Props): [string, BN, boolean] {
  return BN.isBN(value)
    ? getValuesFromBn(value, si)
    : getValuesFromString(value, props);
}

function isNewPropsValue (propsValue: BN | string, value: string, valueBn: BN): boolean {
  return BN.isBN(propsValue) ? !propsValue.eq(valueBn) : propsValue !== value;
}

export default function InputNumber (props: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { bitLength = DEFAULT_BITLENGTH, className, defaultValue = ZERO, help, isDecimal, isFull, isSi, isDisabled, isError = false, maxLength, maxValue, onChange, onEnter, onEscape, placeholder, style, value: propsValue } = props;

  const [si] = useState<SiDef | null>(isSi ? formatBalance.findSi('-') : null);
  const [isPreKeyDown, setIsPreKeyDown] = useState(false);

  const [[value, valueBn, isValid], setValues] = useState<[string, BN, boolean]>(
    getValues(propsValue || defaultValue, si, props)
  );

  useEffect((): void => {
    if (propsValue && isNewPropsValue(propsValue, value, valueBn)) {
      setValues(getValues(propsValue, si, props));
    }
  }, [propsValue]);

  useEffect((): void => {
    setValues(getValues(value, si, props));
  }, [value, si, bitLength, maxValue]);

  useEffect((): void => {
    onChange && onChange(valueBn);
  }, [valueBn]);

  const _onChange = (input: string): void => {
    setValues(getValuesFromString(input, props));
  };

  const _onKeyDown = (event: React.KeyboardEvent<Element>): void => {
    if (KEYS_PRE.includes(event.key)) {
      setIsPreKeyDown(true);
      return;
    }

    if (event.key.length === 1 && !isPreKeyDown) {
      const { selectionStart: i, selectionEnd: j, value } = event.target as HTMLInputElement;
      const newValue = `${value.substring(0, i || 0)}${event.key}${value.substring(j || 0)}`;
      if (!getRegex(isDecimal || !!si).test(newValue.replace(/,/g, ''))) {
        event.preventDefault();
      }
    }
  };

  const _onKeyUp = (event: React.KeyboardEvent<Element>): void => {
    if (KEYS_PRE.includes(event.key)) {
      setIsPreKeyDown(false);
    }
  };

  const _onPaste = (event: React.ClipboardEvent<Element>): void => {
    const { value: newValue } = event.target as HTMLInputElement;
    if (!getRegex(isDecimal || !!si).test(newValue.replace(/,/g, ''))) {
      event.preventDefault();
    }
  };

  const maxValueLength = getGlobalMaxValue(bitLength).toString().length - 1;

  return (
    <Input
      {...props}
      className={classes('ui--InputNumber', className)}
      help={help}
      isDisabled={isDisabled}
      isError={!isValid || isError}
      isFull={isFull}
      maxLength={maxLength || maxValueLength}
      onChange={_onChange}
      onEnter={onEnter}
      onEscape={onEscape}
      onKeyDown={_onKeyDown}
      onKeyUp={_onKeyUp}
      onPaste={_onPaste}
      placeholder={placeholder || t('Positive number')}
      style={style}
      type='text'
      value={value}
    >
    </Input>
  );
}
