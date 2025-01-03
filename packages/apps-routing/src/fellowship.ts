// Copyright 2017-2025 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Route, TFunction } from './types.js';

import Component, { useCounter } from '@polkadot/app-fellowship';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsApi: [
        'tx.fellowshipCollective.vote',
        'tx.fellowshipReferenda.submit',
        'consts.fellowshipReferenda.tracks'
      ]
    },
    group: 'governance',
    icon: 'people-arrows',
    name: 'fellowship',
    text: t('nav.fellowship', 'Fellowship', { ns: 'apps-routing' }),
    useCounter
  };
}
