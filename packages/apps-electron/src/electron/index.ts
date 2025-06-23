// Copyright 2017-2025 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { app, protocol } from 'electron';
import path from 'path';
import { URL } from 'url';

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
    // eslint-disable-next-line deprecation/deprecation
    protocol.registerFileProtocol('app', (request, callback) => {
      const url = new URL(request.url);
      const filePath = path.normalize(path.join(__dirname, url.pathname));

      callback({ path: filePath });
    });

    registerAccountStoreHandlers();
    setupContentSecurityPolicy(ENV);

    await createWindow(ENV);
    await setupAutoUpdater();
  })
  .catch(console.error);
