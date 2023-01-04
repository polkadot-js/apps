// Copyright 2017-2023 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';
import type { Route } from './types';

import Component, { useCounter } from '@polkadot/app-referenda';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsApi: [
        'tx.referenda.submit',
        'tx.convictionVoting.vote'
      ]
    },
    group: 'governance',
    icon: 'person-booth',
    name: 'referenda',
    text: t('nav.referenda', 'Referenda', { ns: 'apps-routing' }),
    useCounter
  };
}
