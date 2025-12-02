// Copyright 2017-2025 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Route, TFunction } from './types.js';

import Component, { useCounter } from '@polkadot/app-reputation-voting';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsApi: [
        'tx.referenda.submit',
        'tx.reputationVoting.vote'
      ]
    },
    group: 'governance',
    icon: 'person-booth',
    name: 'reputation-voting',
    text: t('nav.reputationVoting', 'Reputation Voting', { ns: 'apps-routing' }),
    useCounter
  };
}
