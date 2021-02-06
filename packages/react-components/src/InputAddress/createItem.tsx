// Copyright 2017-2021 @polkadot/react-components authors & contributors
// and @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';

import KeyPair from './KeyPair';
import { Option } from './types';

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
