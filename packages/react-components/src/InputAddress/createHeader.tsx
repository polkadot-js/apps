// Copyright 2017-2021 @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';

import Dropdown from '../Dropdown';

export default function createHeader (option: KeyringSectionOption): React.ReactNode {
  return (
    <Dropdown.Header
      content={option.name}
      key={option.key || option.name}
    />
  );
}
