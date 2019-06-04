// Copyright 2017-2019 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from './types';

import Council from '@polkadot/app-council';

export default ([
  {
    Component: Council,
    display: {
      needsApi: [
        'query.council.candidates'
      ]
    },
    i18n: {
      defaultValue: 'Council'
    },
    icon: 'building',
    name: 'council'
  }
] as Routes);
