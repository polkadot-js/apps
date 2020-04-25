// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from './types';

import Settings, { useCounter } from '@polkadot/app-settings';

export default function create (t: (key: string, text: string, options: { ns: string }) => string): Route {
  return {
    Component: Settings,
    display: {},
    icon: 'settings',
    name: 'settings',
    text: t('nav.settings', 'Settings', { ns: 'apps-routing' }),
    useCounter
  };
}
