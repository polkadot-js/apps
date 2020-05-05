// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from './types';

import Extrinsics from '@polkadot/app-extrinsics';

export default function create (t: (key: string, text: string, options: { ns: string }) => string): Route {
  return {
    Component: Extrinsics,
    display: {
      needsAccounts: true,
      needsApi: []
    },
    icon: 'sync',
    name: 'extrinsics',
    text: t('nav.extrinsics', 'Extrinsics', { ns: 'apps-routing' })
  };
}
