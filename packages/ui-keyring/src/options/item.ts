// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { KeyringOption } from '../types';

import React from 'react';

import KeyPair from './KeyPair';

export default function createItem (address: string, _name?: string): KeyringOption {
  const name = _name === undefined
    ? `${address.slice(0, 16)}…`
    : _name;

  return {
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
