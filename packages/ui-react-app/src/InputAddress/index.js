// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { BareProps } from '../types';

import './InputAddress.css';

import React from 'react';
import addressDecode from '@polkadot/util-keyring/address/decode';

// TODO: We need to actually pass the keyring in, this is the testing keyring
import keyring from '../keyring';
import RxDropdown from '../RxDropdown';
import PairDisplay from './PairDisplay';

type Props = BareProps & {
  isError?: boolean,
  label?: string,
  // flowlint-next-line unclear-type:off
  onChange?: (value: any) => void | rxjs$Subject<*>
};

const options = keyring.getPairs().map((pair) => ({
  text: (
    <PairDisplay pair={pair} />
  ),
  value: pair.address()
}));

const transform = (value: string): Uint8Array =>
  addressDecode(value);

export default function InputAddress ({ className, isError, label, onChange, style }: Props): React$Node {
  return (
    <RxDropdown
      className={['ui--InputAddress', className].join(' ')}
      isError={isError}
      label={label}
      onChange={onChange}
      options={options}
      transform={transform}
    />
  );
}
