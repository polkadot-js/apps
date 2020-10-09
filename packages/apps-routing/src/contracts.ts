// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Route } from './types';

import Component from '@polkadot/app-contracts';

export default function create (t: <T = string> (key: string, text: string, options: { ns: string }) => T): Route {
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
    text: t<string>('nav.contracts', 'Contracts', { ns: 'apps-routing' })
  };
}
