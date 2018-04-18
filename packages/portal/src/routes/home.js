// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Routes } from '../types';

import Home from '@polkadot/app-home';

export default ([
  {
    component: Home,
    i18n: {
      defaultValue: 'Home'
    },
    icon: 'home',
    isExact: true,
    isHidden: false,
    key: 'home',
    path: '/'
  }
]: Routes);
