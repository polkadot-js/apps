// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

// setup these right at front
import '@polkadot/apps/initSettings';
import 'semantic-ui-css/semantic.min.css';
import '@polkadot/react-components/i18n';

import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Api } from '@polkadot/react-api';
import Apps from '@polkadot/apps/Apps';
import WindowDimensions from '@polkadot/apps/WindowDimensions';
import Queue from '@polkadot/react-components/Status/Queue';
import { BlockAuthors, Events } from '@polkadot/react-query';
import settings from '@polkadot/ui-settings';

import { electronMainApi } from './api/global-exported-api';
import { RemoteElectronStore } from './renderer/remote-electron-store';

const rootId = 'root';
const rootElement = document.getElementById(rootId);
const theme = { theme: settings.uiTheme };

const store = new RemoteElectronStore(electronMainApi.accountStore);

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
                <WindowDimensions>
                  <Apps />
                </WindowDimensions>
              </HashRouter>
            </Events>
          </BlockAuthors>
        </Api>
      </Queue>
    </ThemeProvider>
  </Suspense>,
  rootElement
);
