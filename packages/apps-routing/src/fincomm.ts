// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from './types';

import Component, { useCounter } from '@polkadot/app-fin-comm';

export default function create(t: <T = string> (key: string, text: string, options: { ns: string }) => T): Route {
  return {
    Component,
    display: {
      needsAccounts: true,
      needsApi: [
        'query.financialCommittee.members'
      ]
    },
    group: 'governance',
    icon: 'microchip',
    name: 'fincomm',
    text: t<string>('nav.fin-comm', 'Fin. comm.', { ns: 'apps-routing' }),
    useCounter
  };
}
