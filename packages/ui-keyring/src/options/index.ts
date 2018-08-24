// Copyright 2017-2018 @polkadot/ui-keyring authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { State } from '../types';
import { SingleAddress } from '../observable/types';
import { KeyringOptions, KeyringSectionOptions } from './types';

import { BehaviorSubject } from 'rxjs';

import observableAll from '../observable';
import createHeader from './header';

function addAccounts ({ accounts }: State, options: KeyringOptions): void {
  const available = accounts.subject.getValue();

  Object
    .keys(available)
    .map((address) =>
      available[address]
    )
    .forEach(({ json: { meta: { isTesting = false } }, option }: SingleAddress) => {
      if (!isTesting) {
        options.account.push(option);
      } else {
        options.testing.push(option);
      }
    });
}

function addAddresses ({ addresses }: State, options: KeyringOptions): void {
  const available = addresses.subject.getValue();

  Object
    .keys(available)
    .map((address) =>
      available[address]
    )
    .forEach(({ json: { meta: { isRecent = false } }, option }: SingleAddress) => {
      if (isRecent) {
        options.recent.push(option);
      } else {
        options.address.push(option);
      }
    });
}

function emptyOptions (): KeyringOptions {
  return {
    account: [],
    address: [],
    all: [],
    recent: [],
    testing: []
  };
}

const optionsSubject: BehaviorSubject<KeyringOptions> = new BehaviorSubject(emptyOptions());

// NOTE To be called _only_ once (should be addressed with https://github.com/polkadot-js/apps/issues/138)
export default function initOptions (state: State): void {
  observableAll.subscribe((value) => {
    const options = emptyOptions();

    addAccounts(state, options);
    addAddresses(state, options);

    options.address = ([] as KeyringSectionOptions).concat(
      options.address.length ? [ createHeader('Addresses') ] : [],
      options.address,
      options.recent.length ? [ createHeader('Recent') ] : [],
      options.recent
    );
    options.account = ([] as KeyringSectionOptions).concat(
      options.account.length ? [ createHeader('Accounts') ] : [],
      options.account,
      options.testing.length ? [ createHeader('Development') ] : [],
      options.testing
    );

    options.all = ([] as KeyringSectionOptions).concat(
      options.account,
      options.address
    );

    optionsSubject.next(options);
  });
}

export {
  optionsSubject
};
