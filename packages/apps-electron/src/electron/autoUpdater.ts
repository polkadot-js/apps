// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppUpdater } from 'electron-updater';

export async function setupAutoUpdater (): Promise<void> {
  const { autoUpdater } = await import('electron-updater');

  await setLogger(autoUpdater);
  autoUpdater.checkForUpdatesAndNotify().catch(console.error);
}

async function setLogger (autoUpdater: AppUpdater): Promise<void> {
  const log = await import('electron-log');

  log.transports.file.level = 'debug';
  autoUpdater.logger = log;
}
