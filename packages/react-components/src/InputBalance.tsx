// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { SiDef } from '@polkadot/util/types';

import React, { useMemo } from 'react';

import { formatBalance, isUndefined } from '@polkadot/util';

import InputNumber from './InputNumber.js';

interface Props {
  autoFocus?: boolean;
  children?: React.ReactNode;
  className?: string;
  defaultValue?: BN | string | null;
  isDisabled?: boolean;
  isError?: boolean;
  isFull?: boolean;
  isLoading?: boolean;
  isWarning?: boolean;
  isZeroable?: boolean;
  label?: React.ReactNode;
  labelExtra?: React.ReactNode;
  maxValue?: BN | null;
  onChange?: (value?: BN) => void;
  onEnter?: () => void;
  onEscape?: () => void;
  placeholder?: string;
  siDecimals?: number;
  siSymbol?: string;
  value?: BN | null;
  withEllipsis?: boolean;
  withLabel?: boolean;
  withMax?: boolean;
}

const DEFAULT_BITLENGTH = 128;

function reformat (value?: string | BN | null, isDisabled = false, siDecimals?: number): { defaultValue?: string; siDefault?: SiDef } {
  if (!value) {
    return {};
  }

  const defaultValue = formatBalance(value, {
    decimals: isUndefined(siDecimals)
      ? formatBalance.getDefaults().decimals
      : siDecimals,
    forceUnit: '-',
    withAll: true,
    withSi: false,
    withZero: false
  });

  return {
    defaultValue: isDisabled
      // since we drop 0's ensure we have at least 4 for disabled
      ? `${defaultValue}.`.split('.').slice(0, 2).map((v, i) => i ? v.padEnd(4, '0') : v).join('.')
      // remove the format specifiers for inputs
      : defaultValue.replace(/,/g, ''),
    siDefault: formatBalance.findSi('-')
  };
}

function InputBalance ({ autoFocus, children, className = '', defaultValue: inDefault, isDisabled, isError, isFull, isLoading, isWarning, isZeroable, label, labelExtra, maxValue, onChange, onEnter, onEscape, placeholder, siDecimals, siSymbol, value, withEllipsis, withLabel, withMax }: Props): React.ReactElement<Props> {
  const { defaultValue, siDefault } = useMemo(
    () => reformat(inDefault, isDisabled, siDecimals),
    [inDefault, isDisabled, siDecimals]
  );

  return (
    <InputNumber
      autoFocus={autoFocus}
      bitLength={DEFAULT_BITLENGTH}
      className={`${className} ui--InputBalance`}
      defaultValue={defaultValue}
      isDisabled={isDisabled}
      isError={isError}
      isFull={isFull}
      isLoading={isLoading}
      isSi
      isWarning={isWarning}
      isZeroable={isZeroable}
      label={label}
      labelExtra={labelExtra}
      maxValue={maxValue}
      onChange={onChange}
      onEnter={onEnter}
      onEscape={onEscape}
      placeholder={placeholder}
      siDecimals={siDecimals}
      siDefault={siDefault}
      siSymbol={siSymbol}
      value={value}
      withEllipsis={withEllipsis}
      withLabel={withLabel}
      withMax={withMax}
    >
      {children}
    </InputNumber>
  );
}

export default React.memo(InputBalance);
