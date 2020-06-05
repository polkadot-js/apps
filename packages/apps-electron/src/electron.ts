// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { app, BrowserWindow, dialog, screen } from 'electron';
import { autoUpdater } from 'electron-updater';
import path from 'path';
import { features } from './featureToggles';
import { registerAccountStoreHandlers } from './main/account-store';

const ENV = process.env.NODE_ENV || 'production';
const isDev = ENV === 'development';

function createWindow (): Promise<unknown> {
  const { height, width } = screen.getPrimaryDisplay().workAreaSize;

  const win = new BrowserWindow({
    height,
    webPreferences: {
      enableRemoteModule: false,
      nodeIntegration: true
    },
    width
  });

  if (isDev) {
    win.webContents.openDevTools();

    return win.loadURL('http://0.0.0.0:3000/');
  }

  const mainFilePath = path.resolve(__dirname, 'index.html');

  return win.loadFile(mainFilePath);
}

const onReady = async () => {
  registerAccountStoreHandlers();
  await createWindow();

  if (features.autoUpdater) {
    await autoUpdater.checkForUpdatesAndNotify();
  }
};

app.whenReady().then(onReady).catch(console.error);

if (features.autoUpdater) {
  autoUpdater.on('update-not-available', () => {
    dialog.showMessageBox({
      message: 'Current version is up-to-date.',
      title: 'No Updates'
    }).catch(console.error);
  });

  autoUpdater.on('error', (error) => {
    if (!error) {
      return;
    }

    const err: Error = error as Error;

    dialog.showErrorBox('Auto update error: ', (err.stack || err).toString());
  });
}
