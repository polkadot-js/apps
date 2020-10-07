// Copyright 2017-2020 @canvas-ui/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { KeyringJson, KeyringStore } from '@polkadot/ui-keyring/types';
import { electronMainApi } from '../api/global-exported-api';

export class RemoteElectronStore implements KeyringStore {
  all (cb: (key: string, value: KeyringJson) => void): void {
    electronMainApi.accountStore.all()
      .then((result: { key: string, value: KeyringJson }[]) => result.forEach(({ key, value }) => cb(key, value)))
      .catch(() => {
        throw new Error('error getting all accounts');
      });
  }

  get (key: string, cb: (value: KeyringJson) => void): void {
    electronMainApi.accountStore.get(key)
      .then(cb).catch(() => {
        throw new Error('error storing account');
      });
  }

  remove (key: string, cb: (() => void) | undefined): void {
    electronMainApi.accountStore.remove(key).then(cb).catch(() => {
      throw new Error('error removing account');
    });
  }

  set (key: string, value: KeyringJson, cb: (() => void) | undefined): void {
    electronMainApi.accountStore.set(key, value).then(cb).catch(() => {
      throw new Error('error saving account');
    });
  }
}
