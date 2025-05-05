// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';
import type { Option } from './types.js';

import React from 'react';

import { keyring } from '@polkadot/ui-keyring';
import { decodeAddress } from '@polkadot/util-crypto';

import KeyPair from './KeyPair.js';

export default function createItem (option: KeyringSectionOption, isUppercase = true): Option | null {
  const allowedLength = keyring.keyring.type === 'ethereum'
    ? 20
    : 32;

  try {
    if (decodeAddress(option.key).length >= allowedLength) {
      return {
        ...option,
        text: (
          <KeyPair
            address={option.key || ''}
            isUppercase={isUppercase}
            name={option.name}
          />
        )
      };
    }
  } catch {
    // ignore
  }

  return null;
}
