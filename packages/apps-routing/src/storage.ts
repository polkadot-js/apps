// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from './types';

import Storage from '@polkadot/app-storage';

const route: Route = {
  Component: Storage,
  display: {
    needsApi: []
  },
  i18n: {
    defaultValue: 'Chain state'
  },
  icon: 'database',
  name: 'chainstate'
};

export default route;
