// Copyright 2017-2019 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// import first, get the load done
import settings from '@polkadot/ui-settings';

import '@polkadot/ui-app/i18n';
import '@polkadot/ui-app/styles';

import queryString from 'query-string';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import store from 'store';
import { ThemeProvider } from 'styled-components';
import { getTypeRegistry } from '@polkadot/types';
import { Api } from '@polkadot/ui-api';
import { QueueConsumer } from '@polkadot/ui-app/Status/Context';
import Queue from '@polkadot/ui-app/Status/Queue';

import Apps from './Apps';

const rootId = 'root';
const rootElement = document.getElementById(rootId);

// we split here so that both these forms are allowed
//  - http://localhost:3000/?rpc=wss://substrate-rpc.parity.io/#/explorer
//  - http://localhost:3000/#/explorer?rpc=wss://substrate-rpc.parity.io
const urlOptions = queryString.parse(location.href.split('?')[1]);
const wsEndpoint = urlOptions.rpc || process.env.WS_URL || settings.apiUrl;

if (Array.isArray(wsEndpoint)) {
  throw new Error('Invalid WS endpoint specified');
}

if (!rootElement) {
  throw new Error(`Unable to find element with id '${rootId}'`);
}

console.log('WS endpoint=', wsEndpoint);

try {
  const types = store.get('types') || {};
  const names = Object.keys(types);

  if (names.length) {
    getTypeRegistry().register(types);
    console.log('Type registration:', names.join(', '));
  }
} catch (error) {
  console.error('Type registration failed', error);
}

const theme = {
  theme: settings.uiTheme
};

ReactDOM.render(
  <Suspense fallback='...'>
    <Queue>
      <QueueConsumer>
        {({ queuePayload, queueSetTxStatus }): React.ReactNode => (
          <Api
            queuePayload={queuePayload}
            queueSetTxStatus={queueSetTxStatus}
            url={wsEndpoint}
          >
            <HashRouter>
              <ThemeProvider theme={theme}>
                <Apps />
              </ThemeProvider>
            </HashRouter>
          </Api>
        )}
      </QueueConsumer>
    </Queue>
  </Suspense>,
  rootElement
);
