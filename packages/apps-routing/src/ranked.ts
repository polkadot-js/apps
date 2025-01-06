// Copyright 2017-2025 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Route, TFunction } from './types.js';

import Component, { useCounter } from '@polkadot/app-ranked';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsAccounts: true,
      needsApi: [
        'tx.rankedCollective.vote',
        'tx.rankedPolls.submit'
      ]
    },
    group: 'governance',
    icon: 'people-arrows',
    name: 'ranked',
    text: t('nav.ranked', 'Ranked collective', { ns: 'apps-routing' }),
    useCounter
  };
}
