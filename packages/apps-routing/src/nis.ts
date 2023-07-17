// Copyright 2017-2023 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Route } from './types.js';

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
    text: t<string>('nav.nis', 'Non-interactive Staking', { ns: 'apps-routing' })
  };
}
