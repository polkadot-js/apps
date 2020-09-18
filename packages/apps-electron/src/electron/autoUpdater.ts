// Copyright 2017-2020 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
