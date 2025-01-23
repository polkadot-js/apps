// Copyright 2017-2025 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Route, TFunction } from './types.js';

import Component, { useCounter } from '@polkadot/app-council';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsApi: [
        'query.council.prime'
      ],
      needsApiInstances: true
    },
    group: 'governance',
    icon: 'building',
    name: 'council',
    text: t('nav.council', 'Council', { ns: 'apps-routing' }),
    useCounter
  };
}
