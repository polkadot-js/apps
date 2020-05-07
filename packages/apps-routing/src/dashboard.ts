// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from './types';

import Dashboard from '@polkadot/app-dashboard';

export default function create (t: (key: string, text: string, options: { ns: string }) => string): Route {
  return {
    Component: Dashboard,
    display: {
      isHidden: true
    },
    icon: 'th',
    name: 'dashboard',
    text: t('nav.dashboard', 'Dashboard', { ns: 'apps-routing' })
  };
}
