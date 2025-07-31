// Copyright 2017-2025 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

// setup these right at front
import './preInit.js';
import './initBufferHack.js';
import './initSettings.js';

import 'semantic-ui-css/semantic.min.css';
import '@polkadot/react-components/i18n';
import '@polkadot/api-augment/substrate';

import React from 'react';
import { createRoot } from 'react-dom/client';

import Root from './Root.js';

if (typeof window !== 'undefined') {
  // Clear any custom endpoints that might have ws://
  const customEndpoints = localStorage.getItem('polkadot-apps-custom-endpoints');
  if (customEndpoints && (customEndpoints.includes('ws://') || customEndpoints.includes('108.143.71.208'))) {
    console.log('Clearing insecure custom endpoints');
    localStorage.removeItem('polkadot-apps-custom-endpoints');
  }
  
  // Force set the correct endpoint
  console.log('Setting ESX endpoint to wss://rpc1-weu-testnet.esx.network');
  window.localStorage.setItem('settings.apiUrl', 'wss://rpc1-weu-testnet.esx.network');
}

const rootId = 'root';
const rootElement = document.getElementById(rootId);

if (!rootElement) {
  throw new Error(`Unable to find element with id '${rootId}'`);
}

createRoot(rootElement).render(
  <Root isElectron={false} />
);
