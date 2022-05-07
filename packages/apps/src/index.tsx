// Copyright 2017-2022 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

// setup these right at front
import './initSettings';
import 'semantic-ui-css/semantic.min.css';
import '@polkadot/react-components/i18n';
import '@polkadot/api-augment/substrate';

import React from 'react';
import { createRoot } from 'react-dom/client';

import Root from './Root';

const rootId = 'root';
const rootElement = document.getElementById(rootId);

if (!rootElement) {
  throw new Error(`Unable to find element with id '${rootId}'`);
}

createRoot(rootElement).render(
  <Root isElectron={false} />
);
