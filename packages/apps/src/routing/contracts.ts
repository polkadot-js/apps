// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from '../types';

import Contracts from '@polkadot/app-contracts';

export default ([
  {
    Component: Contracts,
    display: {
      needsAccounts: true,
      needsApi: [
        'tx.contract.call'
      ]
    },
    i18n: {
      defaultValue: 'Contracts'
    },
    icon: 'compress',
    name: 'contracts'
  }
] as Routes);
