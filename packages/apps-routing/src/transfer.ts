// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { TFunction } from 'i18next';

import Modal from '@polkadot/app-accounts/modals/Transfer';

import type { Route } from './types';

export default function create (t: TFunction): Route {
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
    text: t('nav.transfer', 'Transfer', { ns: 'apps-routing' })
  };
}
