// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from './types';

import Democracy, { useCounter } from '@polkadot/app-democracy';

const route: Route = {
  Component: Democracy,
  display: {
    needsApi: [
      'tx.democracy.notePreimage'
    ]
  },
  i18n: {
    defaultValue: 'Democracy'
  },
  icon: 'calendar check',
  name: 'democracy',
  useCounter
};

export default route;
