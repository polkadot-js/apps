// Copyright 2017-2023 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';
import type { Option } from './types';

import React from 'react';

import { keyring } from '@polkadot/ui-keyring';
import { decodeAddress } from '@polkadot/util-crypto';

import KeyPair from './KeyPair';

export default function createItem (option: KeyringSectionOption, isUppercase = true): Option | null {
  try {
    const u8a = decodeAddress(option.key);

    if (u8a.length !== (keyring.keyring.type === 'ethereum' ? 20 : 32)) {
      return null;
    }
  } catch {
    return null;
  }

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
