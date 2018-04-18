// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import 'semantic-ui-css/semantic.min.css';
import './semantic.css';
import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import { HashRouter } from 'react-router-dom';
import ContextProvider from '@polkadot/rx-react/ContextProvider';

import i18n from './i18n';
import App from './App';

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <ContextProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </ContextProvider>
  </I18nextProvider>,
  // flowlint-next-line unclear-type:off
  ((document.getElementById('root'): any): Element)
);
