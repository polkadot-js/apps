// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Routes } from '../types';

import Extrinsics from '@polkadot/app-extrinsics';

export default ([
  {
    component: Extrinsics,
    i18n: {
      defaultValue: 'Extrinsics'
    },
    icon: 'send',
    isExact: false,
    isHidden: false,
    name: 'extrinsics'
  }
]: Routes);
