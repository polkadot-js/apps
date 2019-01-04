// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from '../types';

import Accounts from '@polkadot/app-accounts/index';

export default ([
  {
    Component: Accounts,
    i18n: {
      defaultValue: 'Accounts'
    },
    icon: 'users',
    isApiGated: true,
    isHidden: false,
    name: 'accounts'
  }
] as Routes);
