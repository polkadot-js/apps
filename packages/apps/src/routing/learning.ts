// Copyright 2017-2019 @polkadot/learning authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from '../types';

import Learning from '@polkadot/app-learning';

export default ([
  {
    Component: Learning,
    display: {
      isHidden: false,
      needsAccounts: true,
      needsApi: [
        'query.democracy.nextTally',
        'tx.balances.transfer',
        'tx.contract.call',
        'tx.staking.bond' // current bonding API
        // 'tx.staking.stake' // previous staking API
      ]
    },
    i18n: {
      defaultValue: 'Learning'
    },
    icon: 'graduation',
    name: 'learning'
  }
] as Routes);
