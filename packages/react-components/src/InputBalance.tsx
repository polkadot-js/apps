// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { SiDef } from '@polkadot/util/types';

import React, { useMemo } from 'react';
import styled from 'styled-components';

import { BN, BN_TEN, formatBalance, isUndefined } from '@polkadot/util';

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

const DEFAULT_BITLENGTH = 128;

function reformat (value?: string | BN, isDisabled?: boolean, siDecimals?: number): { defaultValue?: string; siDefault?: SiDef } {
  if (!value) {
    return {};
  }

  // based on the number of decimals defined, get the maximum length
  const decimals = isUndefined(siDecimals)
    ? formatBalance.getDefaults().decimals
    : siDecimals;
  const maxDisabled = BN_TEN.pow(new BN(decimals - 1)).toString(10);

  // convert to a string value and reformat it, with the actual calculated decimals
  const strValue = value.toString();
  const siDefault = (strValue.length < maxDisabled.length) && strValue !== '0'
    ? formatBalance.calcSi(strValue, decimals)
    : formatBalance.findSi('-');

  // we format and split - since we want to ensure we don't lose any
  // relevent details, we actually want to bypass the formatter here
  const formatted = formatBalance(strValue, {
    decimals,
    forceUnit: siDefault.value,
    withSi: false
  });
  let defaultValue = formatted;

  if (!isDisabled) {
    // find the position of the seperator and work around it
    const preLength = formatted.indexOf('.');
    const pre = strValue.slice(0, preLength);
    let post = strValue.slice(preLength);

    // remove all trailing zeros
    while (post.length && post[post.length - 1] === '0') {
      post = post.slice(0, -1);
    }

    // ensure we are at at least 4 decimals
    if (post.length < 4) {
      post = `${post}0000`.slice(0, 4);
    }

    // combine the 2 parts again
    defaultValue = `${pre}.${post}`;
  }

  return {
    defaultValue: isDisabled
      ? defaultValue
      : defaultValue.replace(/,/g, isDisabled ? ',' : ''),
    siDefault
  };
}

function InputBalance ({ autoFocus, children, className = '', defaultValue: inDefault, help, isDisabled, isError, isFull, isWarning, isZeroable, label, labelExtra, maxValue, onChange, onEnter, onEscape, placeholder, siDecimals, siSymbol, value, withEllipsis, withLabel, withMax }: Props): React.ReactElement<Props> {
  const { defaultValue, siDefault } = useMemo(
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
        font-size: var(--font-size-small);
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        left: 0.5rem;
        width: 3rem;
      }
    }
  }
`);
