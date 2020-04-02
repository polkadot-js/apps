// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from './types';

import Dashboard from '@polkadot/app-dashboard';

const route: Route = {
  Component: Dashboard,
  display: {
    isHidden: true
  },
  i18n: {
    defaultValue: 'Dashboard'
  },
  icon: 'th',
  name: 'dashboard'
};

export default route;
