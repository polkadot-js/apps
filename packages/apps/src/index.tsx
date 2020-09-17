// Copyright 2017-2020 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

// setup these right at front
import './initSettings';
import 'semantic-ui-css/semantic.min.css';
import '@polkadot/react-components/i18n';

import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Api } from '@polkadot/react-api';
import Queue from '@polkadot/react-components/Status/Queue';
import { BlockAuthors, Events } from '@polkadot/react-query';
import settings from '@polkadot/ui-settings';

import Apps from './Apps';
import WindowDimensions from './WindowDimensions';

const rootId = 'root';
const rootElement = document.getElementById(rootId);
const theme = { theme: settings.uiTheme };

if (!rootElement) {
  throw new Error(`Unable to find element with id '${rootId}'`);
}

ReactDOM.render(
  <Suspense fallback='...'>
    <ThemeProvider theme={theme}>
      <Queue>
        <Api url={settings.apiUrl}>
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
