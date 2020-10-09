// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Route } from './types';

import Component, { useCounter } from '@polkadot/app-society';

export default function create (t: <T = string> (key: string, text: string, options: { ns: string }) => T): Route {
  return {
    Component,
    display: {
      needsAccounts: true,
      needsApi: [
        'query.society.pot'
      ]
    },
    group: 'network',
    icon: 'hand-spock',
    name: 'society',
    text: t<string>('nav.society', 'Society', { ns: 'apps-routing' }),
    useCounter
  };
}
