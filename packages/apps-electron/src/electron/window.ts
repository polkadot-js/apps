// Copyright 2017-2025 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { BrowserWindow, screen, shell } from 'electron';
import path from 'path';

export function createWindow (environment: string): Promise<unknown> {
  const { height, width } = screen.getPrimaryDisplay().workAreaSize;

  const win = new BrowserWindow({
    height,
    icon: path.join(__dirname, 'icon.png'),
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js')
    },
    width
  });

  if (environment === 'development') {
    win.webContents.openDevTools();

    return win.loadURL('http://127.0.0.1:3000/');
  }

  // Handle attempts to open a new window via window.open()
  win.webContents.setWindowOpenHandler(({ url }) => {
    // Open all http/https URLs externally
    if (url.startsWith('http://') || url.startsWith('https://')) {
      shell.openExternal(url).catch(console.log);

      return { action: 'deny' };
    }

    return { action: 'allow' };
  });

  // Handle in-app navigation attempts, such as clicking on <a href="...">
  win.webContents.on('will-navigate', (event, url) => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      event.preventDefault();
      shell.openExternal(url).catch(console.log);
    }
  });

  const mainFilePath = path.resolve(__dirname, 'index.html');

  return win.loadFile(mainFilePath);
}
