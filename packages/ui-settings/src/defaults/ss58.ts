// Copyright 2017-2019 @plasm/ui-settings authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Option } from '../types';

export const PREFIX_DEFAULT = -1;

export const PREFIXES: Option[] = [
  {
    info: 'default',
    text: 'Default for the connected node',
    value: -1
  },
  {
    info: 'substrate',
    text: 'Substrate (development)',
    value: 42
  },
  {
    info: 'kusama',
    text: 'Kusama (canary)',
    value: 2
  },
  {
    info: 'polkadot',
    text: 'Polkadot (live)',
    value: 0
  },
  {
    info: 'plasm',
    text: 'Plasm Testnet v1 (test net)',
    value: 3
  },
  {
    info: 'plasm',
    text: 'Plasm Testnet v2 (test net)',
    value: 4
  }
];
