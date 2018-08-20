// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { State, KeyringJson, KeyringOptions } from '../types';

import createItem from './item';
import createHeader from './header';

function addPairs ({ accounts, keyring }: State): void {
  keyring
    .getPairs()
    .forEach((pair) => {
      const address = pair.address();

      accounts.add(address, {
        address,
        meta: pair.getMeta()
      });
    });
}

function addAccounts ({ accounts, isTestMode, options }: State): void {
  const available = accounts.subject.getValue();

  Object
    .keys(available)
    .map((address) =>
      available[address]
    )
    .forEach(({ address, meta: { name, isTesting = false } }: KeyringJson) => {
      const option = createItem(address, name);

      if (!isTesting) {
        options.account.push(option);
      } else if (isTestMode) {
        options.testing.push(option);
      }
    });
}

function addAddresses ({ addresses, options }: State): void {
  const available = addresses.subject.getValue();

  Object
    .keys(available)
    .map((address) =>
      available[address]
    )
    .forEach(({ address, meta: { name, isRecent = false } }: KeyringJson) => {
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
