// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from '../types';

import Transfer from '@polkadot/app-transfer/index';

export default ([
  {
    Component: Transfer,
    display: {
      needsAccounts: true,
      needsApi: [
        'tx.balances.transfer'
      ]
    },
    i18n: {
      defaultValue: 'Transfer'
    },
    icon: 'angle double right',
    name: 'transfer'
  }
] as Routes);
