// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { TFunction } from 'i18next';
import { Route } from './types';

import Component from '@polkadot/app-sudo';

export default function create (t: TFunction): Route {
  return {
    Component,
    display: {
      needsAccounts: true,
      needsApi: [
        'tx.sudo.setKey'
      ],
      needsSudo: true
    },
    group: 'developer',
    icon: 'unlock',
    name: 'sudo',
    text: t<string>('nav.sudo', 'Sudo', { ns: 'apps-routing' })
  };
}
