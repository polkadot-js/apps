// Copyright 2017-2020 @polkadot/apps authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';

// setup these right at front
import 'semantic-ui-css/semantic.min.css';
import '@polkadot/react-components/i18n';

import { ThemeProvider } from 'styled-components';
import settings from '@polkadot/ui-settings';
import Queue from '@polkadot/react-components/Status/Queue';
import { BlockAuthors, Events } from '@polkadot/react-query';
import AccountSidebar from '@polkadot/app-accounts/Sidebar';
import { Api } from '@polkadot/react-api';
import Apps from '@polkadot/apps/Apps';

const rootId = 'root';
const rootElement = document.getElementById(rootId);
const theme = { theme: settings.uiTheme };

if (!rootElement) {
  throw new Error(`Unable to find element with id '${rootId}'`);
}

console.log('Opened in electron app');

ReactDOM.render(
  <Suspense fallback='...'>
    <ThemeProvider theme={theme}>
      <Queue>
        <Api url={settings.apiUrl}>
          <BlockAuthors>
            <Events>
              <AccountSidebar>
                <HashRouter>
                  <Apps />
                </HashRouter>
              </AccountSidebar>
            </Events>
          </BlockAuthors>
        </Api>
      </Queue>
    </ThemeProvider>
  </Suspense>,
  rootElement
);
