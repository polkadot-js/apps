// Copyright 2017-2025 @polkadot/test-support authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyringJson, KeyringStore } from '@polkadot/ui-keyring/types';

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
