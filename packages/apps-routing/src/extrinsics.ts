// Copyright 2017-2019 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from './types';

import Extrinsics from '@polkadot/app-extrinsics';

export default ([
  {
    Component: Extrinsics,
    display: {
      needsAccounts: true,
      needsApi: []
    },
    i18n: {
      defaultValue: 'Extrinsics'
    },
    icon: 'sync',
    name: 'extrinsics'
  }
] as Routes);
