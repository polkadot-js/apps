// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from './types';

import Contracts from '@polkadot/app-contracts';

const route: Route = {
  Component: Contracts,
  display: {
    needsAccounts: true,
    needsApi: [
      [
        'tx.contracts.call', // substrate 2.x
        'tx.contract.call' // substrate 1.x
      ]
    ]
  },
  i18n: {
    defaultValue: 'Contracts'
  },
  icon: 'compress',
  name: 'contracts'
};

export default route;
