// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Props } from '../types';

import React from 'react';
import bnToU8a from '@polkadot/util/bn/toU8a';
import u8aConcat from '@polkadot/util/u8a/concat';

import BytesFile from './File';

export default function Wasm ({ index, isError, label, onChange }: Props): React$Node {
  // TODO: Validate that we have actual proper WASM code
  const _onChange = (value: Uint8Array) =>
    onChange(index, {
      isValid: value.length !== 0,
      value: u8aConcat(bnToU8a(value.length, 32, true), value)
    });

  return (
    <BytesFile
      isError={isError}
      label={label}
      onChange={_onChange}
    />
  );
}
