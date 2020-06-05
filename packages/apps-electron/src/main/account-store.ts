// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
import { FileStore } from '@polkadot/ui-keyring/stores';
import { KeyringJson } from '@polkadot/ui-keyring/types';
import { app, ipcMain } from 'electron';
import path from 'path';

export const registerAccountStoreHandlers = (): void => {
  const defaultStorePath = path.join(app.getPath('userData'), 'polkadot');
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
