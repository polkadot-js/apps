// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { Routes } from '../types';

import Addresses from '@polkadot/app-addresses/src';

export default ([
  {
    Component: Addresses,
    i18n: {
      defaultValue: 'Addresses'
    },
    icon: 'address book',
    isExact: false,
    isHidden: false,
    name: 'addresses'
  }
]: Routes);
