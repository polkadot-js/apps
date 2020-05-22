// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BrowserWindow, app } from 'electron';
import path from 'path';

const environment = process.env.NODE_ENV || 'production';

function createWindow (): void {
  // Create the browser window.
  const win = new BrowserWindow({
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    width: 800
  });

  if (environment === 'development') {
    win.loadURL('http://0.0.0.0:9000/');
    win.webContents.openDevTools();
  } else {
    const mainFilePath = path.resolve(__dirname, 'index.html');

    win.loadFile(mainFilePath);
  }
}

app.whenReady().then(createWindow);
