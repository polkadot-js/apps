// Copyright 2017-2022 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

// setup these right at front
import '@polkadot/apps/initSettings';
import 'semantic-ui-css/semantic.min.css';
import '@polkadot/react-components/i18n';

import React from 'react';
import { createRoot } from 'react-dom/client';

import Root from '@polkadot/apps/Root';

import { electronMainApi } from './api/global-exported-api';
import { RemoteElectronStore } from './renderer/remote-electron-store';

const rootId = 'root';
const rootElement = document.getElementById(rootId);

if (!rootElement) {
  throw new Error(`Unable to find element with id '${rootId}'`);
}

const store = new RemoteElectronStore(electronMainApi.accountStore);

createRoot(rootElement).render(
  <Root
    isElectron
    store={store}
  />
);
