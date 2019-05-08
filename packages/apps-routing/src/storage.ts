// Copyright 2017-2019 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from './types';

import Storage from '@polkadot/app-storage';

export default ([
  {
    Component: Storage,
    display: {
      needsApi: []
    },
    i18n: {
      defaultValue: 'Chain state'
    },
    icon: 'database',
    name: 'chainstate'
  }
] as Routes);
