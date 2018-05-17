// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Routes } from '../types';

import Storage from '@polkadot/app-storage';

export default ([
  {
    Component: Storage,
    i18n: {
      defaultValue: 'Storage'
    },
    icon: 'database',
    isExact: false,
    isHidden: false,
    name: 'storage'
  }
]: Routes);
