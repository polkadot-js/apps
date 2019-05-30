// Copyright 2017-2019 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from './types';

import Transfer from '@polkadot/app-transfer';
import TransferModal from '@polkadot/app-accounts/modals/Transfer';

export default ([
  {
    Component: Transfer,
    Modal: TransferModal,
    display: {
      isHidden: false,
      needsAccounts: true,
      needsApi: [
        'tx.balances.transfer'
      ]
    },
    i18n: {
      defaultValue: 'Transfer'
    },
    icon: 'send',
    name: 'transfer'
  }
] as Routes);
