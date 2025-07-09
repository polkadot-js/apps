// Copyright 2017-2025 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Route, TFunction } from './types.js';

import Component, { useCounter } from '@polkadot/app-society';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsAccounts: true,
      needsApi: [
        'query.society.pot'
      ]
    },
    group: 'network',
    icon: 'hand-spock',
    name: 'society',
    text: t('nav.society', 'Society', { ns: 'apps-routing' }),
    useCounter
  };
}
