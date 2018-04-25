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
import Api from '@polkadot/rx-react/Api';

import i18n from './i18n';

import Portal from './App';
import NotFound from './NotFound';
import routing from './routing';
import urlParams from './urlParams';

const Component = (() => {
  const { app } = urlParams();

  if (app) {
    const route = routing.routes.find(({ name }) => name === app);

    return route
      ? route.component
      : NotFound;
  }

  return Portal;
})();

ReactDOM.render(
  <Api>
    <I18nextProvider i18n={i18n}>
      <HashRouter>
        <Component />
      </HashRouter>
    </I18nextProvider>
  </Api>,
  // flowlint-next-line unclear-type:off
  ((document.getElementById('root'): any): Element)
);
