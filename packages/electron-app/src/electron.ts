// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BrowserWindow, app } from 'electron';

function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    width: 800
  });

  // and load the index.html of the app.
  win.loadFile('index.html');
  win.webContents.openDevTools();
}

app.whenReady().then(createWindow);
