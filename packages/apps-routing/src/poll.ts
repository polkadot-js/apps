// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { TFunction } from 'i18next';
import { Route } from './types';

import { Component, TabsComponent } from '@polkadot/app-poll';

export default function create (t: TFunction): Route {
  return {
    Component,
    TabsComponent,
    display: {
      needsAccounts: true,
      needsApi: [
        'tx.poll.vote'
      ]
    },
    group: 'governance',
    icon: 'podcast',
    name: 'poll',
    text: t('nav.poll', 'Token poll', { ns: 'apps-routing' })
  };
}
