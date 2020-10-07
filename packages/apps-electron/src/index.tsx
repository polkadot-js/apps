// Copyright 2017-2020 @canvas-ui/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

// setup these right at front
import '@canvas-ui/apps/initSettings';
import 'semantic-ui-css/semantic.min.css';
import '@canvas-ui/react-components/i18n';

import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';

import { ThemeProvider } from 'styled-components';
import settings from '@polkadot/ui-settings';
import Queue from '@canvas-ui/react-components/Status/Queue';
import { BlockAuthors, Events } from '@canvas-ui/react-query';
import { Api } from '@canvas-ui/react-api';
import Apps from '@canvas-ui/apps/Apps';
import { RemoteElectronStore } from './renderer/remote-electron-store';

const rootId = 'root';
const rootElement = document.getElementById(rootId);
const theme = { theme: settings.uiTheme };

const store = new RemoteElectronStore();

if (!rootElement) {
  throw new Error(`Unable to find element with id '${rootId}'`);
}

ReactDOM.render(
  <Suspense fallback='...'>
    <ThemeProvider theme={theme}>
      <Queue>
        <Api
          store={store}
          url={settings.apiUrl}
        >
          <BlockAuthors>
            <Events>
              <HashRouter>
                <Apps />
              </HashRouter>
            </Events>
          </BlockAuthors>
        </Api>
      </Queue>
    </ThemeProvider>
  </Suspense>,
  rootElement
);
