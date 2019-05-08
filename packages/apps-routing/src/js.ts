// Copyright 2017-2019 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from './types';

import Js from '@polkadot/app-js';

export default ([
  {
    Component: Js,
    display: {
      needsApi: []
    },
    i18n: {
      defaultValue: 'Javascript'
    },
    icon: 'code',
    name: 'js'
  }
] as Routes);
