// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { KeyringInstance } from '@polkadot/util-keyring/types';
import type { KeyringOptions } from './types';

import React from 'react';

import testKeyring from '../keyring';
import PairDisplay from './PairDisplay';

export default function createOptions (keyring?: KeyringInstance = testKeyring): KeyringOptions {
  return keyring
    .getPairs()
    .map((pair) => ({
      text: (
        <PairDisplay pair={pair} />
      ),
      value: pair.address()
    }));
}
