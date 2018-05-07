// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from '../types';

import './InputAddress.css';

import React from 'react';
import addressDecode from '@polkadot/util-keyring/address/decode';
import addressEncode from '@polkadot/util-keyring/address/encode';

// TODO: We need to actually pass the keyring in, this is the testing keyring
import keyring from '../keyring';
import RxDropdown from '../RxDropdown';
import PairDisplay from './PairDisplay';

type Props = BareProps & {
  defaultValue?: Uint8Array,
  isError?: boolean,
  label?: string,
  onChange: (value: Uint8Array) => void
};

const options = keyring.getPairs().map((pair) => ({
  text: (
    <PairDisplay pair={pair} />
  ),
  value: pair.address()
}));

const transform = (value: string): Uint8Array =>
  addressDecode(value);

export default function InputAddress ({ className, defaultValue, isError, label, onChange, style }: Props): React$Node {
  let _defaultValue;

  if (defaultValue) {
    _defaultValue = addressEncode(defaultValue);
  }

  return (
    <RxDropdown
      className={['ui--InputAddress', className].join(' ')}
      defaultValue={_defaultValue}
      isError={isError}
      label={label}
      onChange={onChange}
      options={options}
      transform={transform}
    />
  );
}
