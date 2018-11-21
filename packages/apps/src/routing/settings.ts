// Copyright 2017-2018 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from '../types';

import Settings from '@polkadot/app-settings/index';

export default ([
  {
    Component: Settings,
    i18n: {
      defaultValue: 'Settings'
    },
    icon: 'settings',
    isApiGated: false,
    isHidden: false,
    name: 'settings'
  }
] as Routes);
