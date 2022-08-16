// Copyright 2017-2022 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Route } from './types';

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
