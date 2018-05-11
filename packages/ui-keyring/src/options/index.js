// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { State, KeyringJson } from '../types';

import createItem from './item';
import createHeader from './header';

export default function createOptions (state: State): void {
  state.options = {
    account: [],
    address: [],
    all: [],
    recent: [],
    testing: []
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
    // $FlowFixMe values() -> mixed, this is an object
    .forEach(({ address, meta: { name, isTesting = false } }: KeyringJson) => {
      const option = createItem(address, name);

      if (isTesting) {
        options.testing.push(option);
      } else {
        options.account.push(option);
      }
    });

  Object
    .values(available.address)
    // $FlowFixMe values() -> mixed, this is an object
    .forEach(({ address, meta: { name, isRecent = false } }: KeyringJson) => {
      if (available.account[address]) {
        return;
      }

      const option = createItem(address, name);

      if (isRecent) {
        options.recent.push(option);
      } else {
        options.address.push(option);
      }
    });

  options.address = [].concat(
    options.address.length ? [ createHeader('Addresses') ] : [],
    options.address,
    options.recent.length ? [ createHeader('Recent') ] : [],
    options.recent
  );
  options.account = [].concat(
    options.account.length ? [ createHeader('Accounts') ] : [],
    options.account,
    options.testing.length ? [ createHeader('Testing') ] : [],
    options.testing
  );

  options.all = [].concat(options.account, options.address);
}
