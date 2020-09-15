// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringJson, KeyringStore } from '@polkadot/ui-keyring/types';

type AccountsMap = Record<string, KeyringJson>;

export class MemoryStore implements KeyringStore {
  private accounts: AccountsMap = {};

  all (cb: (key: string, value: KeyringJson) => void): void {
    Object.keys(this.accounts).forEach((accountsKey) => cb(accountsKey, this.accounts[accountsKey]));
  }

  get (key: string, cb: (value: KeyringJson) => void): void {
    cb(this.accounts[key]);
  }

  remove (key: string, cb: (() => void) | undefined): void {
    delete this.accounts[key];

    if (cb) {
      cb();
    }
  }

  set (key: string, value: KeyringJson, cb: (() => void) | undefined): void {
    this.accounts[key] = value;

    if (cb) {
      cb();
    }
  }
}
