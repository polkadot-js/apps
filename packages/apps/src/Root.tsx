// Copyright 2017-2020 @polkadot/apps authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { ThemeDef } from '@polkadot/react-components/types';
import { KeyringStore } from '@polkadot/ui-keyring/types';

import React, { Suspense, useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import { HashRouter } from 'react-router-dom';
import { Api } from '@polkadot/react-api';
import Queue from '@polkadot/react-components/Status/Queue';
import { BlockAuthors, Events } from '@polkadot/react-query';
import settings from '@polkadot/ui-settings';

import Apps from './Apps';
import WindowDimensions from './WindowDimensions';
import { darkTheme, lightTheme } from './themes';

interface Props {
  store?: KeyringStore;
}

function createTheme ({ uiTheme }: { uiTheme: string }): ThemeDef {
  return uiTheme === 'dark'
    ? darkTheme
    : lightTheme;
}

function Root ({ store }: Props): React.ReactElement<Props> {
  const [theme, setTheme] = useState(createTheme(settings));

  useEffect((): void => {
    settings.on('change', (settings) => setTheme(createTheme(settings)));
  }, []);

  return (
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
    </Suspense>
  );
}

export default React.memo(Root);
