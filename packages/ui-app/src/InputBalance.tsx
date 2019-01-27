// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, BitLength } from './types';

import BN from 'bn.js';
import React from 'react';
import { BitLengthOption } from '@polkadot/ui-app/constants';
import { InputNumber } from '@polkadot/ui-app/index';

type Props = BareProps & {
  autoFocus?: boolean,
  defaultValue?: string,
  isDisabled?: boolean,
  isError?: boolean,
  label?: any,
  onChange?: (value?: BN) => void,
  placeholder?: string,
  value?: BN | string,
  withLabel?: boolean
};

const DEFAULT_BITLENGTH = BitLengthOption.CHAIN_SPEC as BitLength;

export default class InputBalance extends React.PureComponent<Props> {
  render () {
    const { autoFocus, className, defaultValue, isDisabled, isError, label, onChange, placeholder, style, value, withLabel } = this.props;

    return (
      <InputNumber
        autoFocus={autoFocus}
        className={className}
        bitLength={DEFAULT_BITLENGTH}
        defaultValue={defaultValue || '0'}
        isDisabled={isDisabled}
        isError={isError}
        isSi
        label={label}
        onChange={onChange}
        placeholder={placeholder}
        style={style}
        value={value}
        withLabel={withLabel}
      />
    );
  }
}
