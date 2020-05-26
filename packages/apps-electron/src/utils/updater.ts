// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { autoUpdater } from 'electron-updater';
import { is } from 'electron-util';

export default async function updateApp (): Promise<void> {
  // Skip update in MAS build (updates are handled by App Store)
  if (!is.macAppStore) {
    await autoUpdater.checkForUpdatesAndNotify();
  }
}
