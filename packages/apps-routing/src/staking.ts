// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from './types';

import Staking, { useCounter } from '@polkadot/app-staking';

export default ([
  {
    Component: Staking,
    useCounter,
    display: {
      needsApi: [
        [
          'tx.staking.bond' // current bonding API
          // 'tx.staking.stake' // previous staking API
        ]
      ]
    },
    i18n: {
      defaultValue: 'Staking'
    },
    icon: 'certificate',
    name: 'staking'
  }
] as Routes);
