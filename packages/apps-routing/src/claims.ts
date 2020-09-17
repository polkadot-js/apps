// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Route } from './types';

import Component, { useCounter } from '@polkadot/app-claims';

export default function create (t: <T = string> (key: string, text: string, options: { ns: string }) => T): Route {
  return {
    Component,
    display: {
      needsAccounts: true,
      needsApi: [
        'query.claims.claims'
      ]
    },
    group: 'accounts',
    icon: 'star',
    name: 'claims',
    text: t<string>('nav.claims', 'Claim Tokens', { ns: 'apps-routing' }),
    useCounter
  };
}
