// Copyright 2017-2025 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Route, TFunction } from './types.js';

import Component from '@polkadot/app-nis';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsApi: [
        'tx.nis.placeBid',
        'query.proxy.proxies'
      ]
    },
    group: 'network',
    icon: 'leaf',
    name: 'nis',
    text: t('nav.nis', 'Non-interactive Staking', { ns: 'apps-routing' })
  };
}
