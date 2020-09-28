// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Route } from './types';

import Component from '@polkadot/app-staking';

export default function create (t: <T = string> (key: string, text: string, options: { ns: string }) => T): Route {
  return {
    Component,
    display: {
      needsApi: [
        ['tx.staking.bond']
      ]
    },
    group: 'network',
    icon: 'certificate',
    name: 'staking',
    text: t<string>('nav.staking', 'Staking', { ns: 'apps-routing' })
  };
}
