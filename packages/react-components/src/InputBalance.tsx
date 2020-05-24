// Copyright 2017-2020 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, BitLength } from './types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { BitLengthOption } from '@polkadot/react-components/constants';
import { formatBalance, isBn } from '@polkadot/util';
import InputNumber from './InputNumber';

interface Props extends BareProps {
  autoFocus?: boolean;
  defaultValue?: BN | string;
  help?: React.ReactNode;
  isDisabled?: boolean;
  isError?: boolean;
  isFull?: boolean;
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
const TEN = new BN(10);
const THOUSAND = new BN(1000);

function reformat (value: string | BN, isDisabled?: boolean): string {
  if (isBn(value)) {
    let fmt = (value.mul(THOUSAND).div(TEN.pow(new BN(formatBalance.getDefaults().decimals))).toNumber() / 1000).toFixed(3);

    while (fmt.length !== 1 && ['.', '0'].includes(fmt[fmt.length - 1])) {
      const isLast = fmt.endsWith('.');

      fmt = fmt.substr(0, fmt.length - 1);

      if (isLast) {
        break;
      }
    }

    return fmt;
  }

  return formatBalance(value, { forceUnit: '-', withSi: false }).replace(',', isDisabled ? ',' : '');
}

function InputBalance ({ autoFocus, className = '', defaultValue: inDefault, help, isDisabled, isError, isFull, isZeroable, label, labelExtra, maxValue, onChange, onEnter, onEscape, placeholder, value, withEllipsis, withLabel, withMax }: Props): React.ReactElement<Props> {
  const [defaultValue, setDefaultValue] = useState<string | undefined>();

  useEffect((): void => {
    inDefault && setDefaultValue(
      reformat(inDefault, isDisabled)
    );
  }, [inDefault, isDisabled]);

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
    />
  );
}

export default React.memo(styled(InputBalance)`
  &&:not(.label-small) .labelExtra {
    right: 6.5rem;
  }

  .ui.action.input.ui--Input .ui.primary.buttons .ui.disabled.button.compact.floating.selection.dropdown.ui--SiDropdown {
    border-style: solid;
    opacity: 1 !important;
  }
`);
