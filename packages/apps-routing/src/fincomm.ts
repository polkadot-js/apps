// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Route } from './types';
import Component, { useCounter } from '@polkadot/app-fin-comm';

export default function create (t: <T = string> (key: string, text: string, options: { ns: string }) => T): Route {
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
