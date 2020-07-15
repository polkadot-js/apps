// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { ipcMain } from 'electron';
import { IpcMainHandler } from './ipc-main-handler';

export const registerIpcHandler = (ipcHandler: IpcMainHandler): void => {
  for (const [channel, listener] of Object.entries(ipcHandler)) {
    ipcMain.handle(channel, (_, ...args): void => {
      listener(...args);
    });
  }
};
