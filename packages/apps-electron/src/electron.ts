// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BrowserWindow, app, screen } from 'electron';
import path from 'path';

const environment = process.env.NODE_ENV || 'production';

function createWindow (): Promise<unknown> {
  const { height, width } = screen.getPrimaryDisplay().workAreaSize;

  const win = new BrowserWindow({
    height,
    webPreferences: {
      nodeIntegration: true
    },
    width
  });

  if (environment === 'development') {
    win.webContents.openDevTools();

    return win.loadURL('http://0.0.0.0:9000/');
  }

  const mainFilePath = path.resolve(__dirname, 'index.html');

  return win.loadFile(mainFilePath);
}

app.whenReady().then(createWindow).catch(console.error);
