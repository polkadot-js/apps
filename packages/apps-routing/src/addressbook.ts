// Copyright 2017-2020 @polkadot/apps-routing authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Routes } from './types';

import AddressBook from '@polkadot/app-address-book';
import { faAddressBook } from '@fortawesome/free-solid-svg-icons';

export default ([
  {
    Component: AddressBook,
    display: {
      needsApi: []
    },
    i18n: {
      defaultValue: 'Address book'
    },
    icon: faAddressBook,
    name: 'addressbook',
    isAdvanced: false
  }
] as Routes);
