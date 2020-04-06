// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from './types';

import Settings, { useCounter } from '@polkadot/app-settings';

const route: Route = {
  Component: Settings,
  display: {},
  i18n: {
    defaultValue: 'Settings'
  },
  icon: 'settings',
  name: 'settings',
  useCounter
};

export default route;
