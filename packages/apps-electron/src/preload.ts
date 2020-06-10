// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { KeyringJson } from '@polkadot/ui-keyring/types';
import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('ElectronMain', {
  accountStore: {
    all: () => ipcRenderer.invoke('account-store-all'),
    get: (key: string) => ipcRenderer.invoke('account-store-get', key),
    remove: (key: string) => ipcRenderer.invoke('account-store-remove', key),
    set: (key: string, value: KeyringJson) => ipcRenderer.invoke('account-store-set', key, value)
  }
});
