// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { SiDef } from '@polkadot/util/types';

import React, { useMemo, useState } from 'react';

import { formatBalance, isUndefined } from '@polkadot/util';

import { TokenUnit } from './InputConsts/units.js';
import InputNumber from './InputNumber.js';
import { styled } from './styled.js';
import { useTranslation } from './translate.js';

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
  const { t } = useTranslation();

  const { defaultValue, siDefault } = useMemo(
    () => reformat(inDefault, isDisabled, siDecimals),
    [inDefault, isDisabled, siDecimals]
  );

  const [si] = useState<SiDef | null>(() =>
    siDefault || formatBalance.findSi('-')
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
      labelExtra={
        <LabelledExtra>
          {labelExtra}
          {!!si && (siSymbol || TokenUnit.abbr) && !isDisabled &&
          <p>
            {t('(enter value in standard units)')}
          </p>
          }
        </LabelledExtra>
      }
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

const LabelledExtra = styled.div`
  display: flex;
  align-items: center;
  gap: 0.1rem;

  p {
    font-size: var(--font-size-tiny);
    font-weight: var(--font-weight-normal);
  }
`;

export default React.memo(InputBalance);
