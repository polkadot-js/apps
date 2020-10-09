// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Route } from './types';

import Component from '@polkadot/app-parachains';

export default function create (t: <T = string> (key: string, text: string, options: { ns: string }) => T): Route {
  return {
    Component,
    display: {
      needsApi: [
        ['query.parachains.code', 'query.parachainUpgrade.didUpdateVFPs']
      ]
    },
    group: 'network',
    icon: 'link',
    name: 'parachains',
    text: t<string>('nav.parachains', 'Parachains', { ns: 'apps-routing' })
  };
}
