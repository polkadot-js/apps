// Copyright 2017-2025 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { app } from 'electron';

import { registerAccountStoreHandlers } from '../main/account-store.js';
import { setupAutoUpdater } from './autoUpdater.js';
import { setupContentSecurityPolicy } from './contentSecurityPolicy.js';
import { createWindow } from './window.js';

const ENV = process.env.NODE_ENV || 'production';

app.on('web-contents-created', (_, webContents): void => {
  webContents.setWindowOpenHandler(() => ({ action: 'allow' }));
});

app
  .whenReady()
  .then(async (): Promise<void> => {
    registerAccountStoreHandlers();
    setupContentSecurityPolicy(ENV);

    await createWindow(ENV);
    await setupAutoUpdater();
  })
  .catch(console.error);
