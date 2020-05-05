// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { SiDef } from '@polkadot/util/types';
import { BareProps, BitLength } from './types';

import BN from 'bn.js';
import React, { useCallback, useEffect, useState } from 'react';
import { formatBalance, isBn } from '@polkadot/util';

import { classes } from './util';
import { BitLengthOption } from './constants';
import Dropdown from './Dropdown';
import Input, { KEYS, KEYS_PRE } from './Input';
import { useTranslation } from './translate';

interface Props extends BareProps {
  autoFocus?: boolean;
  bitLength?: BitLength;
  defaultValue?: string;
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
  value?: BN;
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
      ? `^(0|[1-9]\\d*)(\\${KEYS.DECIMAL}\\d*)?$`
      : '^(0|[1-9]\\d*)$'
  );
}

function getSiOptions (): { text: string; value: string }[] {
  return formatBalance.getOptions().map(({ power, text, value }): { text: string; value: string } => ({
    text: power === 0
      ? TokenUnit.abbr
      : text,
    value
  }));
}

function getSiPowers (si: SiDef | null): [BN, number, number] {
  if (!si) {
    return [ZERO, 0, 0];
  }

  const basePower = formatBalance.getDefaults().decimals;

  return [new BN(basePower + si.power), basePower, si.power];
}

function isValidNumber (bn: BN, bitLength: BitLength, isZeroable: boolean, maxValue?: BN): boolean {
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

function inputToBn (input: string, si: SiDef | null, bitLength: BitLength, isZeroable: boolean, maxValue?: BN): [BN, boolean] {
  const [siPower, basePower, siUnitPower] = getSiPowers(si);

  // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
  const isDecimalValue = input.match(/^(\d+)\.(\d+)$/);

  let result;

  if (isDecimalValue) {
    if (siUnitPower - isDecimalValue[2].length < -basePower) {
      result = new BN(-1);
    }

    const div = new BN(input.replace(/\.\d*$/, ''));
    const modString = input.replace(/^\d+\./, '');
    const mod = new BN(modString);

    result = div
      .mul(TEN.pow(siPower))
      .add(mod.mul(TEN.pow(new BN(basePower + siUnitPower - modString.length))));
  } else {
    result = new BN(input.replace(/[^\d]/g, ''))
      .mul(TEN.pow(siPower));
  }

  return [
    result,
    isValidNumber(result, bitLength, isZeroable, maxValue)
  ];
}

function getValuesFromString (value: string, si: SiDef | null, bitLength: BitLength, isZeroable: boolean, maxValue?: BN): [string, BN, boolean] {
  const [valueBn, isValid] = inputToBn(value, si, bitLength, isZeroable, maxValue);

  return [
    value,
    valueBn,
    isValid
  ];
}

function getValuesFromBn (valueBn: BN, si: SiDef | null): [string, BN, boolean] {
  const value = si
    ? valueBn.div(TEN.pow(new BN(formatBalance.getDefaults().decimals + si.power))).toString()
    : valueBn.toString();

  return [
    value,
    valueBn,
    true
  ];
}

function getValues (value: BN | string = ZERO, si: SiDef | null, bitLength: BitLength, isZeroable: boolean, maxValue?: BN): [string, BN, boolean] {
  return isBn(value)
    ? getValuesFromBn(value, si)
    : getValuesFromString(value, si, bitLength, isZeroable, maxValue);
}

function InputNumber ({ autoFocus, bitLength = DEFAULT_BITLENGTH, className, defaultValue, help, isDecimal, isFull, isSi, isDisabled, isError = false, isZeroable = true, label, labelExtra, maxLength, maxValue, onChange, onEnter, onEscape, placeholder, style, value: propsValue }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const [si, setSi] = useState<SiDef | null>(isSi ? formatBalance.findSi('-') : null);
  const [isPreKeyDown, setIsPreKeyDown] = useState(false);
  const [[value, valueBn, isValid], setValues] = useState<[string, BN, boolean]>(
    getValues(propsValue || defaultValue, si, bitLength, isZeroable, maxValue)
  );

  useEffect((): void => {
    onChange && onChange(valueBn);
  }, [onChange, valueBn]);

  const _onChangeWithSi = useCallback(
    (input: string, si: SiDef | null) => setValues(
      getValuesFromString(input, si, bitLength, isZeroable, maxValue)
    ),
    [bitLength, isZeroable, maxValue]
  );

  const _onChange = useCallback(
    (input: string) => _onChangeWithSi(input, si),
    [_onChangeWithSi, si]
  );

  useEffect((): void => {
    defaultValue && _onChange(defaultValue);
  }, [_onChange, defaultValue]);

  const _onKeyDown = useCallback(
    (event: React.KeyboardEvent<Element>): void => {
      if (KEYS_PRE.includes(event.key)) {
        setIsPreKeyDown(true);

        return;
      }

      if (event.key.length === 1 && !isPreKeyDown) {
        const { selectionEnd: j, selectionStart: i, value } = event.target as HTMLInputElement;
        const newValue = `${value.substring(0, i || 0)}${event.key}${value.substring(j || 0)}`;

        if (!getRegex(isDecimal || !!si).test(newValue)) {
          event.preventDefault();
        }
      }
    },
    [isDecimal, isPreKeyDown, si]
  );

  const _onKeyUp = useCallback(
    (event: React.KeyboardEvent<Element>): void => {
      if (KEYS_PRE.includes(event.key)) {
        setIsPreKeyDown(false);
      }
    },
    []
  );

  const _onPaste = useCallback(
    (event: React.ClipboardEvent<Element>): void => {
      const { value: newValue } = event.target as HTMLInputElement;

      if (!getRegex(isDecimal || !!si).test(newValue)) {
        event.preventDefault();
      }
    },
    [isDecimal, si]
  );

  const _onSelectSiUnit = useCallback(
    (siUnit: string): void => {
      const si = formatBalance.findSi(siUnit);

      setSi(si);
      _onChangeWithSi(value, si);
    },
    [_onChangeWithSi, value]
  );

  const maxValueLength = getGlobalMaxValue(bitLength).toString().length - 1;

  return (
    <Input
      autoFocus={autoFocus}
      className={classes('ui--InputNumber', className)}
      help={help}
      isAction={isSi}
      isDisabled={isDisabled}
      isError={!isValid || isError}
      isFull={isFull}
      label={label}
      labelExtra={labelExtra}
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
      {!!si && (
        <Dropdown
          defaultValue={si.value}
          dropdownClassName='ui--SiDropdown'
          isButton
          onChange={_onSelectSiUnit}
          options={getSiOptions()}
        />
      )}
    </Input>
  );
}

export default React.memo(InputNumber);
