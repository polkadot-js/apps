// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { KeyringOption, KeyringOption$Data } from '../types';

import React from 'react';

import KeyPair from './KeyPair';

export default function createItem (address: string, name?: string, data?: KeyringOption$Data = {}): KeyringOption {
  // flowlint-next-line sketchy-null-string:off
  name = name || `${address.slice(0, 16)}…`;

  return {
    ...data,
    key: address,
    name,
    text: (
      <KeyPair
        address={address}
        name={name}
      />
    ),
    value: address
  };
}
