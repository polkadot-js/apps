// Copyright 2017-2022 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';

import Component from '@polkadot/app-migration';

import type { Route } from './types';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsApi: []
    },
    group: 'network',
    icon: 'calendar-alt',
    name: 'migration',
    text: t('nav.migration', 'Migration', { ns: 'apps-routing' })
  };
}
