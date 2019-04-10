// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from '../types';

import Democracy from '@polkadot/app-democracy';

export default ([
  {
    Component: Democracy,
    display: {
      needsApi: [
        'query.democracy.nextTally'
      ]
    },
    i18n: {
      defaultValue: 'Democracy'
    },
    icon: 'calendar check',
    name: 'democracy'
  }
] as Routes);
