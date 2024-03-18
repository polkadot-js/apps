// Copyright 2017-2024 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Route, TFunction } from './types.js';

import Component, { useCounter } from '@polkadot/app-fellowship-treasury';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsApi: [
        'tx.fellowshipTreasury.proposeSpend'
      ]
    },
    group: 'governance',
    icon: 'gem',
    name: 'fellowship-treasury',
    text: t('nav.fellowship-treasury', 'Fellowship Treasury', { ns: 'apps-routing' }),
    useCounter
  };
}
