// Copyright 2017-2021 @polkadot/react-components authors & contributors
// and @canvas-ui/react-components authors & contributors
// SPDX-License-Identifier: Apache-2.0

import React from 'react';

import { KeyringSectionOption } from '@polkadot/ui-keyring/options/types';

export interface Option extends KeyringSectionOption {
  className?: string;
  text: React.ReactNode;
}
