// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from '../types';

import Addresses from '@polkadot/app-addresses';

export default ([
  {
    Component: Addresses,
    display: {
      needsApi: []
    },
    i18n: {
      defaultValue: 'Addresses'
    },
    icon: 'address book',
    name: 'addresses'
  }
] as Routes);
