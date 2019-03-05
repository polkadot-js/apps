// Copyright 2017-2019 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import settings from '@polkadot/ui-settings';
import './../../ui-app/src/i18n';
import './../../ui-app/src/styles';

import { BareProps } from './types';

import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';
import store from 'store';
import { getTypeRegistry } from '@polkadot/types';
import { Api } from '@polkadot/ui-api/index';

import { QueueConsumer } from '@polkadot/ui-app//Status/Context';
import Queue from '@polkadot/ui-app/Status/Queue';
import Apps from './Apps';
import Connecting from './Connecting';

type Props = BareProps & {
  url?: string
};

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(`Unable to find element with id '${rootId}'`);
}

const url = process.env.WS_URL || settings.apiUrl || undefined;

console.log('Web socket url=', url);
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

const render = App => {
  return ReactDOM.render(
    <Suspense fallback='...'>
      <Queue>
        <QueueConsumer>
          {({ queueExtrinsic, queueSetTxStatus }) => {
            return (
              <Api
                queueExtrinsic={queueExtrinsic}
                queueSetTxStatus={queueSetTxStatus}
                url={url}
              >
                <HashRouter>
                  <App />
                </HashRouter>
              </Api>
            );
          }}
        </QueueConsumer>
      </Queue>
    </Suspense>,
    rootElement
  );
};

render(Apps);

if (module.hot) {
  module.hot.accept('./Apps', () => {
    const app = require('./Apps').default;
    render(app);
  });
}
