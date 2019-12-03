// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, BitLength } from './types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { BitLengthOption } from '@polkadot/react-components/constants';
import { InputNumber } from '@polkadot/react-components';
import { formatBalance } from '@polkadot/util';

interface Props extends BareProps {
  autoFocus?: boolean;
  defaultValue?: BN | string;
  help?: React.ReactNode;
  isDisabled?: boolean;
  isError?: boolean;
  isZeroable?: boolean;
  label?: React.ReactNode;
  labelExtra?: React.ReactNode;
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

const DEFAULT_BITLENGTH = BitLengthOption.CHAIN_SPEC as BitLength;

function InputBalance ({ autoFocus, className, defaultValue: inDefault, help, isDisabled, isError, isZeroable, label, labelExtra, maxValue, onChange, onEnter, onEscape, placeholder, style, value, withEllipsis, withLabel, withMax }: Props): React.ReactElement<Props> {
  const defaultValue = inDefault
    ? formatBalance(inDefault, { forceUnit: '-', withSi: false }).replace(',', isDisabled ? ',' : '')
    : inDefault;

  return (
    <InputNumber
      autoFocus={autoFocus}
      className={`ui--InputBalance ${className}`}
      bitLength={DEFAULT_BITLENGTH}
      defaultValue={defaultValue}
      help={help}
      isDisabled={isDisabled}
      isError={isError}
      isZeroable={isZeroable}
      isSi
      label={label}
      labelExtra={labelExtra}
      maxValue={maxValue}
      onChange={onChange}
      onEnter={onEnter}
      onEscape={onEscape}
      placeholder={placeholder}
      style={style}
      value={value}
      withEllipsis={withEllipsis}
      withLabel={withLabel}
      withMax={withMax}
    />
  );
}

export default styled(InputBalance)`
  &&:not(.label-small) .labelExtra {
    right: 6.5rem;
  }

  .ui.action.input.ui--Input .ui.primary.buttons .ui.disabled.button.compact.floating.selection.dropdown.ui--SiDropdown {
    border-style: solid;
    opacity: 1 !important;
  }
`;
