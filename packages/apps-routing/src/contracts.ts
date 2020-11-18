// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { TFunction } from 'i18next';
import { Route } from './types';

import { Component, TabsComponent, helpText } from '@polkadot/app-contracts';

export default function create (t: TFunction): Route {
  return {
    Component,
    TabsComponent,
    display: {
      needsAccounts: true,
      needsApi: [
        'tx.contracts.call'
      ]
    },
    group: 'developer',
    helpText,
    icon: 'compress',
    name: 'contracts',
    text: t('nav.contracts', 'Contracts', { ns: 'apps-routing' })
  };
}
