// Copyright 2017-2021 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SiDef } from '@polkadot/util/types';
import type { BitLength } from './types';

import BN from 'bn.js';
import React, { useMemo } from 'react';
import styled from 'styled-components';

import { BitLengthOption } from '@polkadot/react-components/constants';
import { formatBalance, isUndefined } from '@polkadot/util';

import InputNumber from './InputNumber';

interface Props {
  autoFocus?: boolean;
  children?: React.ReactNode;
  className?: string;
  defaultValue?: BN | string;
  help?: React.ReactNode;
  isDisabled?: boolean;
  isError?: boolean;
  isFull?: boolean;
  isWarning?: boolean;
  isZeroable?: boolean;
  label?: React.ReactNode;
  labelExtra?: React.ReactNode;
  maxValue?: BN;
  onChange?: (value?: BN) => void;
  onEnter?: () => void;
  onEscape?: () => void;
  placeholder?: string;
  siDecimals?: number;
  siSymbol?: string;
  value?: BN;
  withEllipsis?: boolean;
  withLabel?: boolean;
  withMax?: boolean;
}

const DEFAULT_BITLENGTH = BitLengthOption.CHAIN_SPEC as BitLength;

function reformat (value?: string | BN, isDisabled?: boolean, siDecimals?: number): [string?, SiDef?] {
  if (!value) {
    return [];
  }

  const decimals = isUndefined(siDecimals)
    ? formatBalance.getDefaults().decimals
    : siDecimals;
  const si = isDisabled
    ? formatBalance.calcSi(value.toString(), decimals)
    : formatBalance.findSi('-');

  return [
    formatBalance(value, { decimals, forceUnit: si.value, withSi: false }).replace(',', isDisabled ? ',' : ''),
    si
  ];
}

function InputBalance ({ autoFocus, children, className = '', defaultValue: inDefault, help, isDisabled, isError, isFull, isWarning, isZeroable, label, labelExtra, maxValue, onChange, onEnter, onEscape, placeholder, siDecimals, siSymbol, value, withEllipsis, withLabel, withMax }: Props): React.ReactElement<Props> {
  const [defaultValue, siDefault] = useMemo(
    () => reformat(inDefault, isDisabled, siDecimals),
    [inDefault, isDisabled, siDecimals]
  );

  return (
    <InputNumber
      autoFocus={autoFocus}
      bitLength={DEFAULT_BITLENGTH}
      className={`ui--InputBalance ${className}`}
      defaultValue={defaultValue}
      help={help}
      isDisabled={isDisabled}
      isError={isError}
      isFull={isFull}
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

export default React.memo(styled(InputBalance)`
  &&:not(.isSmall) .labelExtra {
    right: 6.5rem;
  }

  .ui.action.input.ui--Input > .buttons {
    align-items: stretch;

    .ui--SiDropdown.ui.button.compact.floating.selection.dropdown {
      &.disabled {
        border-style: solid;
        opacity: 1 !important;
      }

      > div.text:first-child {
        font-size: 0.9em;
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 0.5rem;
        width: 3rem;
      }
    }
  }
`);
