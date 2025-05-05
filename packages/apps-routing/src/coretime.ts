// Copyright 2017-2025 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Route, TFunction } from './types.js';

import Component from '@polkadot/app-coretime';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsApi: [
        'query.coretimeAssignmentProvider.coreDescriptors'
      ],
      needsApiInstances: true
    },
    group: 'network',
    icon: 'flask',
    name: 'coretime',
    text: t('nav.coretime', 'Coretime', { ns: 'apps-routing' })
  };
}
