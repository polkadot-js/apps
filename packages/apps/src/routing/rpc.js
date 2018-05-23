// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Routes } from '../types';

import Rpc from '@polkadot/app-rpc';

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
]: Routes);
