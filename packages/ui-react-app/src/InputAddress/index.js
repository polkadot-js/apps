// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { KeyringInstance } from '@polkadot/util-keyring/types';
import type { BareProps } from '../types';
import type { KeyringOptions } from './types';

import './InputAddress.css';

import React from 'react';
import addressDecode from '@polkadot/util-keyring/address/decode';
import addressEncode from '@polkadot/util-keyring/address/encode';

import RxDropdown from '../RxDropdown';
import createOptions from './options';

type Props = BareProps & {
  defaultValue?: Uint8Array,
  isError?: boolean,
  keyring?: KeyringInstance,
  label?: string,
  onChange: (value: Uint8Array) => void,
  options?: KeyringOptions
};

const transform = (value: string): Uint8Array =>
  addressDecode(value);

export default function InputAddress ({ className, defaultValue, isError, keyring, label, onChange, options, style }: Props): React$Node {
  const _options = options || createOptions(keyring);
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
      options={_options}
      transform={transform}
    />
  );
}
