// Copyright 2017-2022 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ApiPromise } from '@polkadot/api';
import type { SiDef } from '@polkadot/util/types';
import type { BitLength } from './types';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import { useApi } from '@polkadot/react-hooks';
import { BN, BN_ONE, BN_TEN, BN_TWO, BN_ZERO, formatBalance, isBn, isUndefined } from '@polkadot/util';

import { BitLengthOption } from './constants';
import Dropdown from './Dropdown';
import Input, { KEYS_PRE } from './Input';
import { useTranslation } from './translate';

interface Props {
  autoFocus?: boolean;
  bitLength?: BitLength;
  children?: React.ReactNode;
  className?: string;
  defaultValue?: string | BN;
  help?: React.ReactNode;
  isDisabled?: boolean;
  isError?: boolean;
  isFull?: boolean;
  isSi?: boolean;
  isDecimal?: boolean;
  isWarning?: boolean;
  isZeroable?: boolean;
  label?: React.ReactNode;
  labelExtra?: React.ReactNode;
  maxLength?: number;
  maxValue?: BN;
  onChange?: (value?: BN) => void;
  onEnter?: () => void;
  onEscape?: () => void;
  placeholder?: string;
  siDecimals?: number;
  siDefault?: SiDef;
  siSymbol?: string;
  value?: BN | null;
  withEllipsis?: boolean;
  withLabel?: boolean;
  withMax?: boolean;
}

const DEFAULT_BITLENGTH = BitLengthOption.NORMAL_NUMBERS as BitLength;

export class TokenUnit {
  public static abbr = 'Unit';

  public static setAbbr (abbr: string = TokenUnit.abbr): void {
    TokenUnit.abbr = abbr;
  }
}

function getGlobalMaxValue (bitLength?: number): BN {
  return BN_TWO.pow(new BN(bitLength || DEFAULT_BITLENGTH)).isub(BN_ONE);
}

function getRegex (isDecimal: boolean): RegExp {
  const decimal = '.';

  return new RegExp(
    isDecimal
      ? `^(0|[1-9]\\d*)(\\${decimal}\\d*)?$`
      : '^(0|[1-9]\\d*)$'
  );
}

function getSiOptions (symbol: string, decimals?: number): { text: string; value: string }[] {
  return formatBalance.getOptions(decimals).map(({ power, text, value }): { text: string; value: string } => ({
    text: power === 0
      ? symbol
      : text,
    value
  }));
}

function getSiPowers (si: SiDef | null, decimals?: number): [BN, number, number] {
  if (!si) {
    return [BN_ZERO, 0, 0];
  }

  const basePower = isUndefined(decimals)
    ? formatBalance.getDefaults().decimals
    : decimals;

  return [new BN(basePower + si.power), basePower, si.power];
}

function isValidNumber (bn: BN, bitLength: BitLength, isZeroable: boolean, maxValue?: BN): boolean {
  if (
    // cannot be negative
    bn.lt(BN_ZERO) ||
    // cannot be > than allowed max
    bn.gt(getGlobalMaxValue(bitLength)) ||
    // check if 0 and it should be a value
    (!isZeroable && bn.isZero()) ||
    // check that the bitlengths fit
    (bn.bitLength() > (bitLength || DEFAULT_BITLENGTH)) ||
    // cannot be > max (if specified)
    (maxValue && maxValue.gtn(0) && bn.gt(maxValue))
  ) {
    return false;
  }

  return true;
}

function inputToBn (api: ApiPromise, input: string, si: SiDef | null, bitLength: BitLength, isZeroable: boolean, maxValue?: BN, decimals?: number): [BN, boolean] {
  const [siPower, basePower, siUnitPower] = getSiPowers(si, decimals);

  // eslint-disable-next-line @typescript-eslint/prefer-regexp-exec
  const isDecimalValue = input.match(/^(\d+)\.(\d+)$/);

  let result;

  if (isDecimalValue) {
    if (siUnitPower - isDecimalValue[2].length < -basePower) {
      result = new BN(-1);
    }

    const div = new BN(input.replace(/\.\d*$/, ''));
    const modString = input.replace(/^\d+\./, '').substr(0, api.registry.chainDecimals[0]);
    const mod = new BN(modString);

    result = div
      .mul(BN_TEN.pow(siPower))
      .add(mod.mul(BN_TEN.pow(new BN(basePower + siUnitPower - modString.length))));
  } else {
    result = new BN(input.replace(/[^\d]/g, ''))
      .mul(BN_TEN.pow(siPower));
  }

  return [
    result,
    isValidNumber(result, bitLength, isZeroable, maxValue)
  ];
}

function getValuesFromString (api: ApiPromise, value: string, si: SiDef | null, bitLength: BitLength, isZeroable: boolean, maxValue?: BN, decimals?: number): [string, BN, boolean] {
  const [valueBn, isValid] = inputToBn(api, value, si, bitLength, isZeroable, maxValue, decimals);

  return [
    value,
    valueBn,
    isValid
  ];
}

function getValuesFromBn (valueBn: BN, si: SiDef | null, isZeroable: boolean, _decimals?: number): [string, BN, boolean] {
  const decimals = isUndefined(_decimals)
    ? formatBalance.getDefaults().decimals
    : _decimals;
  const value = si
    ? valueBn.div(BN_TEN.pow(new BN(decimals + si.power))).toString()
    : valueBn.toString();

  return [
    value,
    valueBn,
    isZeroable ? true : valueBn.gt(BN_ZERO)
  ];
}

function getValues (api: ApiPromise, value: BN | string = BN_ZERO, si: SiDef | null, bitLength: BitLength, isZeroable: boolean, maxValue?: BN, decimals?: number): [string, BN, boolean] {
  return isBn(value)
    ? getValuesFromBn(value, si, isZeroable, decimals)
    : getValuesFromString(api, value, si, bitLength, isZeroable, maxValue, decimals);
}

function InputNumber ({ autoFocus, bitLength = DEFAULT_BITLENGTH, children, className = '', defaultValue, help, isDecimal, isFull, isSi, isDisabled, isError = false, isWarning, isZeroable = true, label, labelExtra, maxLength, maxValue, onChange, onEnter, onEscape, placeholder, siDecimals, siDefault, siSymbol, value: propsValue }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const [si, setSi] = useState<SiDef | null>(() =>
    isSi
      ? siDefault || formatBalance.findSi('-')
      : null
  );
  const [[value, valueBn, isValid], setValues] = useState<[string, BN, boolean]>(() =>
    getValues(api, propsValue || defaultValue, si, bitLength, isZeroable, maxValue, siDecimals)
  );
  const [isPreKeyDown, setIsPreKeyDown] = useState(false);

  const siOptions = useMemo(
    () => getSiOptions(siSymbol || TokenUnit.abbr, siDecimals),
    [siDecimals, siSymbol]
  );

  useEffect((): void => {
    onChange && onChange(isValid ? valueBn : undefined);
  }, [isValid, onChange, valueBn]);

  const _onChangeWithSi = useCallback(
    (input: string, si: SiDef | null) => setValues(
      getValuesFromString(api, input, si, bitLength, isZeroable, maxValue, siDecimals)
    ),
    [api, bitLength, isZeroable, maxValue, siDecimals]
  );

  const _onChange = useCallback(
    (input: string) => _onChangeWithSi(input, si),
    [_onChangeWithSi, si]
  );

  useEffect((): void => {
    defaultValue && _onChange(defaultValue.toString());
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

  // Same as the number of digits, which means it can still overflow, i.e.
  // for u8 we allow 3, which could be 999 (however 2 digits will limit to only 99,
  // so this is more-or-less the lesser of evils without a max-value check)
  const maxValueLength = getGlobalMaxValue(bitLength).toString().length;

  return (
    <Input
      autoFocus={autoFocus}
      className={`ui--InputNumber${isDisabled ? ' isDisabled' : ''} ${className}`}
      help={help}
      isAction={isSi}
      isDisabled={isDisabled}
      isError={!isValid || isError}
      isFull={isFull}
      isWarning={isWarning}
      label={label}
      labelExtra={labelExtra}
      maxLength={maxLength || maxValueLength}
      onChange={_onChange}
      onEnter={onEnter}
      onEscape={onEscape}
      onKeyDown={_onKeyDown}
      onKeyUp={_onKeyUp}
      onPaste={_onPaste}
      placeholder={placeholder || t<string>('Positive number')}
      type='text'
      value={value}
    >
      {!!si && (
        <Dropdown
          defaultValue={
            isDisabled && siDefault
              ? siDefault.value
              : si.value
          }
          dropdownClassName='ui--SiDropdown'
          isButton
          onChange={
            isDisabled
              ? undefined
              : _onSelectSiUnit
          }
          options={siOptions}
        />
      )}
      {children}
    </Input>
  );
}

export default React.memo(styled(InputNumber)`
  &.isDisabled {
    .ui--SiDropdown {
      background: transparent;
      border-color: var(--border-input) !important;
      border-style: dashed;
      color: #666 !important;
      cursor: default !important;

      .dropdown.icon {
        display: none;
      }
    }
  }

  .ui.buttons+.ui--Toggle.isOverlay {
    bottom: 1.1rem;
    right: 6.5rem;
  }
`);
