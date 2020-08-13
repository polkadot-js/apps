// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from './types';

import Icon from '@polkadot/apps-config/ui/icons/chain.svg';
import Component from '@polkadot/app-parachains';

export default function create (t: <T = string> (key: string, text: string, options: { ns: string }) => T): Route {
  return {
    Component,
    display: {
      needsApi: [
        ['query.parachains.code', 'query.parachainUpgrade.didUpdateVFPs']
      ]
    },
    icon: Icon as string,
    name: 'parachains',
    text: t<string>('nav.parachains', 'Parachains', { ns: 'apps-routing' })
  };
}
