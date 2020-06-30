// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { app } from 'electron';
import { features } from '../featureToggles';
import { registerAccountStoreHandlers } from '../main/account-store';
import { setupAutoUpdater } from './autoUpdater';
import { createWindow } from './window';

const ENV = process.env.NODE_ENV || 'production';

const onReady = async () => {
  registerAccountStoreHandlers();
  await createWindow(ENV);

  if (features.autoUpdater) {
    await setupAutoUpdater();
  }
};

app.whenReady().then(onReady).catch(console.error);
