// Copyright 2017-2023 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Route } from './types';

import Component from '@polkadot/app-collator';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsApi: [
        'query.collatorSelection.candidacyBond'
      ]
    },
    group: 'network',
    icon: 'timeline',
    name: 'collators',
    text: t<string>('nav.collator', 'Collators', { ns: 'apps-routing' })
  };
}
