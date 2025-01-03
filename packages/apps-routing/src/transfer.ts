// Copyright 2017-2025 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Route, TFunction } from './types.js';

import { TransferModal as Modal } from '@polkadot/react-components';

export default function create (t: TFunction): Route {
  return {
    Component: Modal,
    Modal,
    display: {
      isHidden: false,
      needsAccounts: true,
      needsApi: [
        'tx.balances.transferKeepAlive'
      ]
    },
    group: 'accounts',
    icon: 'paper-plane',
    name: 'transfer',
    text: t('nav.transfer', 'Transfer', { ns: 'apps-routing' })
  };
}
