// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { app, shell } from 'electron';
import { registerAccountStoreHandlers } from '../main/account-store';
import { setupAutoUpdater } from './autoUpdater';
import { setupContentSecurityPolicy } from './contentSecurityPolicy';
import { createWindow } from './window';

const ENV = process.env.NODE_ENV || 'production';

const onReady = async () => {
  registerAccountStoreHandlers();
  setupContentSecurityPolicy(ENV);
  await createWindow(ENV);
  await setupAutoUpdater();
};

app.on('web-contents-created', (e, webContents) => {
  webContents.on('new-window', (e, url) => {
    e.preventDefault();
    shell.openExternal(url).catch(console.error);
  });
});

app.whenReady().then(onReady).catch(console.error);
