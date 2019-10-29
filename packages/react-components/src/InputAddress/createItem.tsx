// Copyright 2017-2019 @polkadot/react-components authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

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
