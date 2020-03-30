// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from './types';

import Accounts from '@polkadot/app-accounts';
import { faUsers } from '@fortawesome/free-solid-svg-icons';

export default ([
  {
    Component: Accounts,
    display: {
      needsApi: []
    },
    i18n: {
      defaultValue: 'Accounts'
    },
    icon: faUsers,
    name: 'accounts',
    isAdvanced: false
  }
] as Routes);
