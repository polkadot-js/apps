// Copyright 2017-2025 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Route, TFunction } from './types.js';

import Component from '@polkadot/app-staking-next';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      // TODO: Add check when to show this page
      needsApi: []
    },
    group: 'network',
    icon: 'certificate',
    name: 'staking-next',
    text: t('nav.staking-next', 'Staking Next', { ns: 'apps-routing' })
  };
}
