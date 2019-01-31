// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from '../types';

import Nodeinfo from '@polkadot/app-nodeinfo/index';

export default ([
  {
    Component: Nodeinfo,
    display: {
      needsApi: []
    },
    i18n: {
      defaultValue: 'Node info'
    },
    icon: 'tty',
    name: 'nodeinfo'
  }
] as Routes);
