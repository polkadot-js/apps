// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from '../types';

import Democracy from '@polkadot/app-democracy/index';

export default ([
  {
    Component: Democracy,
    i18n: {
      defaultValue: 'Democracy'
    },
    icon: 'calendar check',
    isApiGated: true,
    isHidden: false,
    name: 'democracy',
    needsApi: [
      'query.democracy.nextTally'
    ]
  }
] as Routes);
