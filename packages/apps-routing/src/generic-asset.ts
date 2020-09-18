// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Route } from './types';

import Component from '@polkadot/app-generic-asset';

export default function create (t: <T = string> (key: string, text: string, options: { ns: string }) => T): Route {
  return {
    Component,
    display: {
      isHidden: false,
      needsAccounts: true,
      needsApi: [
        'tx.genericAsset.transfer'
      ]
    },
    group: 'network',
    icon: 'cubes',
    name: 'generic-asset',
    text: t<string>('nav.generic-asset', 'Generic asset', { ns: 'apps-routing' })
  };
}
