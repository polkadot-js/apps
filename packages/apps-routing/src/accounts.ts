// Copyright 2017-2019 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from './types';

import Accounts from '@polkadot/app-accounts';

export default ([
  {
    Component: Accounts,
    display: {
      needsApi: []
    },
    i18n: {
      defaultValue: 'Accounts'
    },
    icon: 'users',
    name: 'accounts'
  }
] as Routes);
