// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from './types';

import Treasury, { useCounter } from '@polkadot/app-treasury';

export default function create (t: (key: string, text: string, options: { ns: string }) => string): Route {
  return {
    Component: Treasury,
    display: {
      needsAccounts: true,
      needsApi: [
        'tx.treasury.proposeSpend'
      ]
    },
    icon: 'gem',
    name: 'treasury',
    text: t('nav.treasury', 'Treasury', { ns: 'apps-routing' }),
    useCounter
  };
}
