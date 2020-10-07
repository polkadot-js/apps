// Copyright 2017-2020 @canvas-ui/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { FileStore } from '@polkadot/ui-keyring/stores';
import { KeyringJson } from '@polkadot/ui-keyring/types';
import { app, ipcMain } from 'electron';
import path from 'path';

const ACCOUNTS_SUBFOLDER = 'polkadot-accounts';

export const registerAccountStoreHandlers = (): void => {
  const defaultStorePath = path.join(app.getPath('userData'), ACCOUNTS_SUBFOLDER);
  const fileStore = new FileStore(defaultStorePath);

  ipcMain.handle('account-store-set', async (_, key: string, value: KeyringJson) => new Promise((resolve) =>
    fileStore.set(key, value, resolve)
  ));

  ipcMain.handle('account-store-get', async (_, key: string) => new Promise((resolve) =>
    fileStore.get(key, resolve)
  ));

  ipcMain.handle('account-store-remove', async (_, key: string) => new Promise((resolve) =>
    fileStore.remove(key, resolve)
  ));

  ipcMain.handle('account-store-all', () => {
    let result: { key: string, value: KeyringJson }[] = [];

    const collect = (key: string, value: KeyringJson) => {
      result = [...result, { key, value }];
    };

    fileStore.all(collect);

    return result;
  });
};
