// Copyright 2017-2018 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Routes } from '../types';

import Rpc from '@polkadot/app-rpc/index';

export default ([
  {
    Component: Rpc,
    i18n: {
      defaultValue: 'Raw RPC'
    },
    icon: 'code',
    isExact: false,
    isHidden: false,
    name: 'rpc'
  }
] as Routes);
