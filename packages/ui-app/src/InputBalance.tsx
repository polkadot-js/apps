// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, BitLength } from './types';

import BN from 'bn.js';
import React from 'react';
import { BitLengthOption } from '@polkadot/ui-app/constants';
import { InputNumber } from '@polkadot/ui-app';

interface Props extends BareProps {
  autoFocus?: boolean;
  defaultValue?: BN | string;
  help?: React.ReactNode;
  isDisabled?: boolean;
  isError?: boolean;
  label?: any;
  maxValue?: BN;
  onChange?: (value?: BN) => void;
  onEnter?: () => void;
  placeholder?: string;
  value?: BN | string;
  withEllipsis?: boolean;
  withLabel?: boolean;
  withMax?: boolean;
}

const DEFAULT_BITLENGTH = BitLengthOption.CHAIN_SPEC as BitLength;

export default class InputBalance extends React.PureComponent<Props> {
  public render (): React.ReactNode {
    const { autoFocus, className, defaultValue, help, isDisabled, isError, label, maxValue, onChange, onEnter, placeholder, style, value, withEllipsis, withLabel, withMax } = this.props;

    return (
      <InputNumber
        autoFocus={autoFocus}
        className={className}
        bitLength={DEFAULT_BITLENGTH}
        defaultValue={defaultValue}
        help={help}
        isDisabled={isDisabled}
        isError={isError}
        isSi
        label={label}
        maxValue={maxValue}
        onChange={onChange}
        onEnter={onEnter}
        placeholder={placeholder}
        style={style}
        value={value}
        withEllipsis={withEllipsis}
        withLabel={withLabel}
        withMax={withMax}
      />
    );
  }
}
