// Copyright 2017-2020 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ipcMain } from 'electron';
import { IpcMainHandler } from './ipc-main-handler';

export const registerIpcHandler = (ipcHandler: IpcMainHandler): void => {
  for (const [channel, listener] of Object.entries(ipcHandler)) {
    ipcMain.handle(channel, (_, ...args): void => {
      listener(...args);
    });
  }
};
