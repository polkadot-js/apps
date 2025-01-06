// Copyright 2017-2025 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Route, TFunction } from './types.js';

import Component, { useCounter } from '@polkadot/app-alliance';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsApi: [
        'tx.alliance.joinAlliance'
      ]
    },
    group: 'governance',
    icon: 'people-group',
    name: 'alliance',
    text: t('nav.alliance', 'Alliance', { ns: 'apps-routing' }),
    useCounter
  };
}
