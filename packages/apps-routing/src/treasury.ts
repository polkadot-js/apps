// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from './types';

import Treasury, { useCounter } from '@polkadot/app-treasury';

const route: Route = {
  Component: Treasury,
  display: {
    needsAccounts: true,
    needsApi: [
      'tx.treasury.proposeSpend'
    ]
  },
  i18n: {
    defaultValue: 'Treasury'
  },
  icon: 'gem',
  name: 'treasury',
  useCounter
};

export default route;
