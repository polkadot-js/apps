// Copyright 2017-2025 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { app, protocol } from 'electron';
import mime from 'mime';
import { readFile } from 'node:fs/promises';
import path from 'path';

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
    // protocol.registerFileProtocol('app', (request, callback) => {
    //   const url = request.url.slice(6); // strip off "app://"
    //   const resolvedPath = path.join(__dirname, '..', 'build', url); // adjust "build" as needed

    //   callback({ path: resolvedPath });
    // });

    protocol.handle('app', async (request) => {
      const url = new URL(request.url);

      console.log(request.url, url, 'request url');
      const pathname = url.pathname === '/' ? '/index.html' : url.pathname;

      const filePath = path.join(__dirname, request.url.slice(6));
      const mimeType = mime.getType(filePath) || 'text/plain';

      console.log(filePath, 'file path');

      try {
        const data = await readFile(filePath);

        return new Response(data, {
          headers: {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            'Content-Type': mimeType
          }
        });
      } catch (err) {
        console.error('Failed to load:', filePath, err);

        return new Response('Not found', { status: 404 });
      }
    });

    registerAccountStoreHandlers();
    setupContentSecurityPolicy(ENV);

    await createWindow(ENV);
    await setupAutoUpdater();
  })
  .catch(console.error);
