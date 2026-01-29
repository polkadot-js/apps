// Copyright 2017-2025 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore Warned on by nodenext resolution (while package does build in bundler mode)
import type { KeyringJson, KeyringStore } from '@polkadot/ui-keyring/types';
import type { AccountStoreApi } from '../api/account-store-api.js';

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
