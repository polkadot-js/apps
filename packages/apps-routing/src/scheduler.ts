// Copyright 2017-2023 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Route } from './types.js';

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
    text: t<string>('nav.scheduler', 'Scheduler', { ns: 'apps-routing' })
  };
}
