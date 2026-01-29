// Copyright 2017-2025 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { IpcMainHandler } from './ipc-main-handler.js';

import electron from 'electron';

export const registerIpcHandler = (ipcHandler: IpcMainHandler): void => {
  for (const [channel, listener] of Object.entries(ipcHandler)) {
    electron.ipcMain.handle(channel, (_, ...args: unknown[]) => {
      return listener(...args);
    });
  }
};
