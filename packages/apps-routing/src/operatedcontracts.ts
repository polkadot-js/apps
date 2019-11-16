// Copyright 2017-2019 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from './types';

import OperatedContracts from '@polkadot/app-operated-contracts';

export default ([
  {
    Component: OperatedContracts,
    display: {
      isHidden: false,
      needsAccounts: true,
      needsApi: [
        [
          'tx.operator.instantiate' // substrate 2.x          
        ]
      ]
    },
    i18n: {
      defaultValue: 'OP Contracts'
    },
    icon: 'compress',
    name: 'operated-contracts'
  }
] as Routes);
