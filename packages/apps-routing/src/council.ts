// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from './types';

import Council, { useCounter } from '@polkadot/app-council';

const route: Route = {
  Component: Council,
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
  name: 'council',
  useCounter
};

export default route;
