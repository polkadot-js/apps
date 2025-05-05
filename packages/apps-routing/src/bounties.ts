// Copyright 2017-2025 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Route, TFunction } from './types.js';

import Component, { useCounter } from '@polkadot/app-bounties';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsApi: [
        ['tx.bounties.proposeBounty', 'tx.treasury.proposeBounty']
      ]
    },
    group: 'governance',
    icon: 'coins',
    name: 'bounties',
    text: t('nav.bounties', 'Bounties', { ns: 'apps-routing' }),
    useCounter
  };
}
