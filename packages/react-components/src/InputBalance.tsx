// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BitLength } from './types';

import BN from 'bn.js';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { BitLengthOption } from '@polkadot/react-components/constants';
import { BN_TEN, BN_THOUSAND, formatBalance, isBn } from '@polkadot/util';

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
  value?: BN;
  withEllipsis?: boolean;
  withLabel?: boolean;
  withMax?: boolean;
}

const DEFAULT_BITLENGTH = BitLengthOption.CHAIN_SPEC as BitLength;

function reformat (value: string | BN, isDisabled?: boolean): string {
  if (isBn(value)) {
    let fmt = (value.mul(BN_THOUSAND).div(BN_TEN.pow(new BN(formatBalance.getDefaults().decimals))).toNumber() / 1000).toFixed(3);

    while (fmt.length !== 1 && ['.', '0'].includes(fmt[fmt.length - 1])) {
      const isLast = fmt.endsWith('.');

      fmt = fmt.substr(0, fmt.length - 1);

      if (isLast) {
        break;
      }
    }

    return fmt;
  }

  // The following log is intentional as it shows the exact value
  console.log(`Balance is ${value}`);

  return formatBalance(value, { forceUnit: '-', withSi: false }).replace(',', isDisabled ? ',' : '');
}

function InputBalance ({ autoFocus, children, className = '', defaultValue: inDefault, help, isDisabled, isError, isFull, isWarning, isZeroable, label, labelExtra, maxValue, onChange, onEnter, onEscape, placeholder, value, withEllipsis, withLabel, withMax }: Props): React.ReactElement<Props> {
  const defaultValue = useMemo(
    () => inDefault ? reformat(inDefault, isDisabled) : undefined,
    [inDefault, isDisabled]
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
