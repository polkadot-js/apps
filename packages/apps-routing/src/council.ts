// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Route } from './types';

import Component, { useCounter } from '@polkadot/app-council';

export default function create (t: <T = string> (key: string, text: string, options: { ns: string }) => T): Route {
  return {
    Component,
    display: {
      needsApi: [
        [
          'query.electionsPhragmen.candidates',
          'query.elections.candidates'
        ]
      ]
    },
    group: 'governance',
    icon: 'building',
    name: 'council',
    text: t<string>('nav.council', 'Council', { ns: 'apps-routing' }),
    useCounter
  };
}
