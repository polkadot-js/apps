// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Routes } from '../types';

import Accounts from '@polkadot/app-accounts/src';

export default ([
  {
    component: Accounts,
    i18n: {
      defaultValue: 'Accounts'
    },
    icon: 'users',
    isExact: false,
    isHidden: false,
    name: 'accounts'
  }
]: Routes);
