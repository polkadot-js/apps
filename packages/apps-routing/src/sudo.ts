// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from './types';

import Sudo from '@polkadot/app-sudo';

export default function create (t: (key: string, text: string, options: { ns: string }) => string): Route {
  return {
    Component: Sudo,
    display: {
      needsAccounts: true,
      needsApi: [
        'tx.sudo.setKey'
      ],
      needsSudo: true
    },
    icon: 'unlock',
    name: 'sudo',
    text: t('nav.sudo', 'Sudo', { ns: 'apps-routing' })
  };
}
