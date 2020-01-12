// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from './types';

import Council, { useCounter } from '@polkadot/app-council';

export default ([
  {
    Component: Council,
    useCounter,
    display: {
      needsApi: [
        [
          'query.electionsPhragmen.candidates',
          'query.elections.candidates'
        ]
      ]
    },
    i18n: {
      defaultValue: 'Council'
    },
    icon: 'building',
    name: 'council'
  }
] as Routes);
