// Copyright 2017-2025 @polkadot/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';

import React from 'react';

import Dropdown from '../Dropdown.js';

export default function createHeader (option: KeyringSectionOption): React.ReactNode {
  return (
    <Dropdown.Header
      content={option.name}
      key={option.key || option.name}
    />
  );
}
