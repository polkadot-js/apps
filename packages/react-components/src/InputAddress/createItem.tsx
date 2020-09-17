// Copyright 2017-2020 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';
import { Option } from './types';

import React from 'react';

import KeyPair from './KeyPair';

export default function createItem (option: KeyringSectionOption, isUppercase = true): Option {
  return {
    ...option,
    text: (
      <KeyPair
        address={option.key || ''}
        isUppercase={isUppercase}
        name={name}
      />
    )
  };
}
