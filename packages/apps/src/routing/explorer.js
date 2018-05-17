// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Routes } from '../types';

import Explorer from '@polkadot/app-explorer';

export default ([
  {
    Component: Explorer,
    i18n: {
      defaultValue: 'Explorer'
    },
    icon: 'braille',
    isExact: true,
    isHidden: false,
    name: 'explorer',
    path: '/'
  }
]: Routes);
