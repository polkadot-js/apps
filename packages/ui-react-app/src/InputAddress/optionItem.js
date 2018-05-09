// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { KeyringOption } from './types';

import React from 'react';

import PairDisplay from './PairDisplay';

export default function createItem (address: string, name?: string, isManual: boolean = false): KeyringOption {
  // flowlint-next-line sketchy-null-string:off
  name = name || address;

  return {
    'data-manual': isManual,
    name,
    text: (
      <PairDisplay
        address={address}
        name={name}
      />
    ),
    value: address
  };
}
