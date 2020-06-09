// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from './types';

import FinanceComm, { useCounter } from '@polkadot/app-finance-comm';

export default function create(t: <T = string> (key: string, text: string, options: { ns: string }) => T): Route {
  return {
    Component: FinanceComm,
    display: {
      needsAccounts: true,
      needsApi: [
        'query.financialCommittee.members'
      ]
    },
    icon: 'microchip',
    name: 'financecomm',
    text: t<string>('nav.finance-comm', 'Fin. comm.', { ns: 'apps-routing' }),
    useCounter
  };
}
