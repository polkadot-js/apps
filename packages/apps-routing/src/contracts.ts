// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { TFunction } from 'i18next';
import { Route } from './types';

import Component from '@polkadot/app-contracts';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsAccounts: true,
      needsApi: [
        'tx.contracts.call'
      ]
    },
    group: 'developer',
    icon: 'compress',
    name: 'contracts',
    text: t('nav.contracts', 'Contracts', { ns: 'apps-routing' })
  };
}
