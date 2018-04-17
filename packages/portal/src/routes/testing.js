// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Routes } from '../types';

import Testing from '@polkadot/app-testing';

export default ([
  {
    component: Testing,
    i18n: {
      defaultValue: 'Testing'
    },
    icon: 'braille',
    isExact: true,
    isHidden: false,
    key: 'testing',
    path: '/'
  }
]: Routes);
