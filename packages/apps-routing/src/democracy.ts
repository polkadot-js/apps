// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from './types';

import Democracy, { useCounter } from '@polkadot/app-democracy';

export default ([
  {
    Component: Democracy,
    useCounter,
    display: {
      needsApi: [
        'tx.democracy.notePreimage'
      ]
    },
    i18n: {
      defaultValue: 'Democracy'
    },
    icon: 'calendar check',
    name: 'democracy'
  }
] as Routes);
