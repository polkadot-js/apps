// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BrowserWindow, app, dialog, screen } from 'electron';
import { autoUpdater } from 'electron-updater';
import path from 'path';

const ENV = process.env.NODE_ENV || 'production';
const isDev = ENV === 'development';

function createWindow (): Promise<unknown> {
  const { height, width } = screen.getPrimaryDisplay().workAreaSize;

  const win = new BrowserWindow({
    height,
    webPreferences: {
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
  await createWindow();
  await autoUpdater.checkForUpdatesAndNotify();
  // TODO: Check is promise above resolved
};

app.whenReady().then(onReady).catch(console.error);

autoUpdater.on('update-not-available', () => {
  // eslint-disable-next-line no-void
  void dialog.showMessageBox({
    message: 'Current version is up-to-date.',
    title: 'No Updates'
  });
});

if (isDev) {
  autoUpdater.on('error', (error) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call
    dialog.showErrorBox('Error: ', error == null ? 'unknown' : (error.stack || error).toString());
  });
}
