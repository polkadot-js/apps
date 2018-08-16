// Copyright 2017-2018 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Routes } from '../types';

import Accounts from '@polkadot/app-accounts/index';

export default ([
  {
    Component: Accounts,
    i18n: {
      defaultValue: 'Accounts'
    },
    icon: 'users',
    isHidden: false,
    name: 'accounts'
  }
] as Routes);
