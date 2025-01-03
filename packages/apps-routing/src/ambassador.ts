// Copyright 2017-2025 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Route, TFunction } from './types.js';

import Component, { useCounter } from '@polkadot/app-ambassador';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsApi: [
        'tx.ambassadorCollective.vote',
        'tx.ambassadorReferenda.submit',
        'consts.ambassadorReferenda.tracks'
      ]
    },
    group: 'governance',
    icon: 'user-friends',
    name: 'ambassador',
    text: t('nav.ambassador', 'Ambassador', { ns: 'apps-routing' }),
    useCounter
  };
}
