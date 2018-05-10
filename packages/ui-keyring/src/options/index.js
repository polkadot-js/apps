// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { State, KeyringJson } from '../types';

// import React from 'react';
// import Dropdown from 'semantic-ui-react/dist/es/modules/Dropdown';

import createItem from './item';

export default function createOptions (state: State): void {
  state.options = {
    account: [], // <Dropdown.Header>Accounts</Dropdown.Header> ],
    address: [], // <Dropdown.Header>Addresses</Dropdown.Header> ],
    all: [],
    recent: [], // <Dropdown.Header>Recent</Dropdown.Header> ],
    testing: [] // <Dropdown.Header>Testing</Dropdown.Header> ]
  };

  const { available, keyring, options } = state;

  keyring
    .getPairs()
    .forEach((pair) => {
      const address = pair.address();

      available.account[address] = {
        address,
        meta: pair.getMeta()
      };
    });

  Object
    .values(available.account)
    // $FlowFixMe value -> mixed, this is an object
    .forEach(({ address, meta: { name, isTesting = false, whenCreated = 0, whenEdited = 0, whenUsed = 0 } }: KeyringJson) => {
      const option = createItem(address, name, {
        'data-is-account': true,
        'data-is-testing': isTesting,
        'data-when-created': whenCreated,
        'data-when-edited': whenEdited || whenCreated,
        'data-when-used': whenUsed || whenCreated
      });

      if (isTesting) {
        options.testing.push(option);
      } else {
        options.account.push(option);
      }
    });

  Object
    .values(available.address)
    // $FlowFixMe value -> mixed, this is an object
    .forEach(({ address, meta: { name, isRecent = false, whenCreated = 0, whenEdited = 0, whenUsed = 0 } }: KeyringJson) => {
      if (available.account[address]) {
        return;
      }

      const option = createItem(address, name, {
        'data-is-account': false,
        'data-is-recent': isRecent,
        'data-when-created': whenCreated,
        'data-when-edited': whenEdited || whenCreated,
        'data-when-used': whenUsed || whenCreated
      });

      if (isRecent) {
        options.recent.push(option);
      } else {
        options.address.push(option);
      }
    });

  options.address = options.address.concat(options.recent);
  options.account = options.account.concat(options.testing);
  options.all = options.account.concat(options.address);
}
