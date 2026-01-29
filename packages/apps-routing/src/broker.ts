// Copyright 2017-2025 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Route, TFunction } from './types.js';

import Component from '@polkadot/app-broker';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsApi: [
        'query.broker.status'
      ],
      needsApiInstances: true
    },
    group: 'network',
    icon: 'flask',
    name: 'broker',
    text: t('nav.broker', 'Coretime Broker', { ns: 'app-broker' })
  };
}
