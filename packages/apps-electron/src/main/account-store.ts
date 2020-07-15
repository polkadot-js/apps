// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { app } from 'electron';
import { FileStore } from '@polkadot/ui-keyring/stores';
import { KeyringJson } from '@polkadot/ui-keyring/types';
import path from 'path';

import { IpcMainHandler } from './ipc-main-handler';
import { registerIpcHandler } from './register-ipc-handler';

const ACCOUNTS_SUBFOLDER = 'polkadot-accounts';

export const accountStoreIpcHandler = (fileStore: FileStore): IpcMainHandler => ({
  'account-store-all': () => {
    let result: { key: string, value: KeyringJson }[] = [];

    const collect = (key: string, value: KeyringJson) => {
      result = [...result, { key, value }];
    };

    fileStore.all(collect);

    return result;
  },
  'account-store-get': async (key: string) => new Promise((resolve) => {
    try {
      fileStore.get(key, resolve);
    } catch (err) {
      resolve(null);
    }
  }),
  'account-store-remove': async (key: string) => new Promise((resolve) =>
    fileStore.remove(key, resolve)
  ),
  'account-store-set': async (key: string, value: KeyringJson) => new Promise((resolve) =>
    fileStore.set(key, value, resolve)
  )
});

export const registerAccountStoreHandlers = (): void => {
  const defaultStorePath = path.join(app.getPath('userData'), ACCOUNTS_SUBFOLDER);
  const fileStore = new FileStore(defaultStorePath);

  registerIpcHandler(accountStoreIpcHandler(fileStore));
};
