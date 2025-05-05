// Copyright 2017-2025 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Route, TFunction } from './types.js';

import Component, { useCounter } from '@polkadot/app-referenda';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsApi: [
        'tx.referenda.submit',
        'tx.convictionVoting.vote',
        'consts.referenda.tracks'
      ]
    },
    group: 'governance',
    icon: 'person-booth',
    name: 'referenda',
    text: t('nav.referenda', 'Referenda', { ns: 'apps-routing' }),
    useCounter
  };
}
