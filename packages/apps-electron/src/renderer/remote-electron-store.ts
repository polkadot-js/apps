// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringJson, KeyringStore } from '@polkadot/ui-keyring/types';
import { AccountStoreApi } from '../api/account-store-api';

export class RemoteElectronStore implements KeyringStore {
  readonly #accountStore: AccountStoreApi;

  constructor (accountStore: AccountStoreApi) {
    this.#accountStore = accountStore;
  }

  all (cb: (key: string, value: KeyringJson) => void): void {
    this.#accountStore.all()
      .then((result: { key: string, value: KeyringJson }[]) => result?.forEach(({ key, value }) => cb(key, value)))
      .catch((e: Error) => {
        throw new Error(`error getting all accounts: ${e.message}`);
      });
  }

  get (key: string, cb: (value: KeyringJson) => void): void {
    this.#accountStore.get(key)
      .then(cb).catch((e: Error) => {
        throw new Error(`error storing account: ${e.message}`);
      });
  }

  remove (key: string, cb: (() => void) | undefined): void {
    this.#accountStore.remove(key).then(cb).catch((e: Error) => {
      throw new Error(`error removing account: ${e.message}`);
    });
  }

  set (key: string, value: KeyringJson, cb: (() => void) | undefined): void {
    this.#accountStore.set(key, value).then(cb).catch((e: Error) => {
      throw new Error(`error saving account: ${e.message}`);
    });
  }
}
