// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Route } from './types';

import Modal from '@polkadot/app-accounts/modals/Transfer';

export default function create (t: <T = string> (key: string, text: string, options: { ns: string }) => T): Route {
  return {
    Component: Modal,
    Modal,
    display: {
      isHidden: false,
      needsAccounts: true,
      needsApi: [
        'tx.balances.transfer'
      ]
    },
    group: 'accounts',
    icon: 'paper-plane',
    name: 'transfer',
    text: t<string>('nav.transfer', 'Transfer', { ns: 'apps-routing' })
  };
}
