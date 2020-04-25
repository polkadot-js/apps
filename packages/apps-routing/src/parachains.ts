// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from './types';

import Parachains from '@polkadot/app-parachains';

export default function create (t: (key: string, text: string, options: { ns: string }) => string): Route {
  return {
    Component: Parachains,
    display: {
      needsApi: [
        'query.parachains.code'
      ]
    },
    icon: 'chain',
    name: 'parachains',
    text: t('nav.parachains', 'Parachains', { ns: 'apps-routing' })
  };
}
