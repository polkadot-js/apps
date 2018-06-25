// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { State, KeyringJson, KeyringOptions } from '../types';

import createItem from './item';
import createHeader from './header';

function addPairs ({ available, keyring }: State): void {
  keyring
    .getPairs()
    .forEach((pair) => {
      const address = pair.address();

      available.account[address] = {
        address,
        meta: pair.getMeta()
      };
    });
}

function addAccounts ({ available, isTestMode, options }: State): void {
  Object
    .keys(available.account)
    .map((address) => available.account[address])
    .forEach(({ address, meta: { name, isTesting = false } }: KeyringJson) => {
      const option = createItem(address, name);

      if (!isTesting) {
        options.account.push(option);
      } else if (isTestMode) {
        options.testing.push(option);
      }
    });
}

function addAddresses ({ available, options }: State): void {
  Object
    .keys(available.address)
    .map((address) => available.address[address])
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
}

export default function createOptions (state: State): void {
  state.options = {
    account: [],
    address: [],
    all: [],
    recent: [],
    testing: []
  };

  addPairs(state);
  addAccounts(state);
  addAddresses(state);

  const { options } = state;

  options.address = ([] as KeyringOptions).concat(
    options.address.length ? [ createHeader('Addresses') ] : [],
    options.address,
    options.recent.length ? [ createHeader('Recent') ] : [],
    options.recent
  );
  options.account = ([] as KeyringOptions).concat(
    options.account.length ? [ createHeader('Accounts') ] : [],
    options.account,
    options.testing.length ? [ createHeader('Testing') ] : [],
    options.testing
  );

  options.all = ([] as KeyringOptions).concat(
    options.account,
    options.address
  );
}
