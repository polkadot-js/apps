// Copyright 2017-2021 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { KeyringJson } from '@polkadot/ui-keyring/types';

import { app } from 'electron';
import path from 'path';

import { FileStore } from '@polkadot/ui-keyring/stores';

import { IpcMainHandler } from './ipc-main-handler';
import { registerIpcHandler } from './register-ipc-handler';

const ACCOUNTS_SUBFOLDER = 'polkadot-accounts';

function safeWriteKey (key: string) {
  return key.replace(/:/g, '-');
}

function safeReadKey (key: string) {
  return key.replace(/-/g, ':');
}

export const accountStoreIpcHandler = (fileStore: FileStore): IpcMainHandler => ({
  'account-store-all': () => {
    let result: { key: string, value: KeyringJson }[] = [];

    const collect = (key: string, value: KeyringJson) => {
      result = [...result, { key: safeReadKey(key), value }];
    };

    fileStore.all(collect);

    return result;
  },
  'account-store-get': async (key: string) => new Promise((resolve) => {
    try {
      fileStore.get(safeWriteKey(key), resolve);
    } catch (err) {
      resolve(null);
    }
  }),
  'account-store-remove': async (key: string) => new Promise((resolve) =>
    fileStore.remove(safeWriteKey(key), () => resolve(undefined))
  ),
  'account-store-set': async (key: string, value: KeyringJson) => new Promise((resolve) =>
    fileStore.set(safeWriteKey(key), value, () => resolve(undefined))
  )
});

export const registerAccountStoreHandlers = (): void => {
  const defaultStorePath = path.join(app.getPath('userData'), ACCOUNTS_SUBFOLDER);
  const fileStore = new FileStore(defaultStorePath);

  registerIpcHandler(accountStoreIpcHandler(fileStore));
};
