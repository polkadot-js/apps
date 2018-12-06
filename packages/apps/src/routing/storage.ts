// Copyright 2017-2018 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from '../types';

import Storage from '@polkadot/app-storage/index';

export default ([
  {
    Component: Storage,
    i18n: {
      defaultValue: 'Chain state'
    },
    icon: 'database',
    isApiGated: true,
    isHidden: false,
    name: 'chainstate'
  }
] as Routes);
