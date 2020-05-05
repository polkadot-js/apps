// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from './types';

import Council, { useCounter } from '@polkadot/app-council';

export default function create (t: (key: string, text: string, options: { ns: string }) => string): Route {
  return {
    Component: Council,
    display: {
      needsApi: [
        [
          'query.electionsPhragmen.candidates',
          'query.elections.candidates'
        ]
      ]
    },
    icon: 'building',
    name: 'council',
    text: t('nav.council', 'Council', { ns: 'apps-routing' }),
    useCounter
  };
}
