// Copyright 2017-2025 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Route, TFunction } from './types.js';

import Component from '@polkadot/app-scheduler';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsApi: [
        'query.scheduler.agenda'
      ]
    },
    group: 'network',
    icon: 'clock',
    name: 'scheduler',
    text: t('nav.scheduler', 'Scheduler', { ns: 'apps-routing' })
  };
}
