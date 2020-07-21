// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

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
    icon: 'hand-spock',
    name: 'society',
    text: t<string>('nav.society', 'Society', { ns: 'apps-routing' }),
    useCounter
  };
}
