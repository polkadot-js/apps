// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Route } from './types';
import Component, { useCounter } from '@polkadot/app-root-comm';

export default function create (t: <T = string> (key: string, text: string, options: { ns: string }) => T): Route {
  return {
    Component,
    display: {
      needsAccounts: true,
      needsApi: [
        'query.rootCommittee.members'
      ]
    },
    group: 'governance',
    icon: 'microchip',
    name: 'rootcomm',
    text: t<string>('nav.root-comm', 'Root comm.', { ns: 'apps-routing' }),
    useCounter
  };
}
