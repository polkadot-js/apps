// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Route } from './types';

import Js from '@polkadot/app-js';

const route: Route = {
  Component: Js,
  display: {
    needsApi: []
  },
  i18n: {
    defaultValue: 'Javascript'
  },
  icon: 'code',
  name: 'js'
};

export default route;
