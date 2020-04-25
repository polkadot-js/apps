// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from './types';

import Storage from '@polkadot/app-storage';

export default function create (t: (key: string, text: string, options: { ns: string }) => string): Route {
  return {
    Component: Storage,
    display: {
      needsApi: []
    },
    icon: 'database',
    name: 'chainstate',
    text: t('nav.storage', 'Chain state', { ns: 'apps-routing' })
  };
}
