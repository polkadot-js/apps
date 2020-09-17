// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Route } from './types';

import Component, { useCounter } from '@polkadot/app-accounts';

export default function create (t: <T = string> (key: string, text: string, options: { ns: string }) => T): Route {
  return {
    Component,
    display: {
      needsApi: []
    },
    group: 'accounts',
    icon: 'users',
    name: 'accounts',
    text: t<string>('nav.accounts', 'Accounts', { ns: 'apps-routing' }),
    useCounter
  };
}
