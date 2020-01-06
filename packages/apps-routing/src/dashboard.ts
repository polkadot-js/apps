// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from './types';

import Dashboard from '@polkadot/app-dashboard';

export default ([
  {
    Component: Dashboard,
    display: {
      isHidden: true
    },
    i18n: {
      defaultValue: 'Dashboard'
    },
    icon: 'th',
    name: 'dashboard'
  }
] as Routes);
