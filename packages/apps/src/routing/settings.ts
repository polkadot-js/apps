// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from '../types';

import Settings from '@polkadot/app-settings/index';

export default ([
  {
    Component: Settings,
    display: {
      needsApi: []
    },
    i18n: {
      defaultValue: 'Settings'
    },
    icon: 'settings',
    name: 'settings'
  }
] as Routes);
