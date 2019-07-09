// Copyright 2017-2019 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from './types';

import Parachains from '@polkadot/app-parachains';

export default ([
  {
    Component: Parachains,
    display: {
      needsApi: [
        'query.parachains.code'
      ]
    },
    i18n: {
      defaultValue: 'Parachains'
    },
    icon: 'chain',
    name: 'parachains'
  }
] as Routes);
