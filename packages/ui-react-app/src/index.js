// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

require('./i18n');
require('./styles');

const React = require('react');
const ReactDOM = require('react-dom');
const { HashRouter } = require('react-router-dom');
const Api = require('@polkadot/rx-react/Api');

module.exports = function createApp (App: React$ComponentType<*>, rootId: string = 'root'): void {
  const rootElement = document.getElementById(rootId);

  if (!rootElement) {
    throw new Error(`Unable to find root id '${rootId}'`);
  }

  ReactDOM.render(
    <Api>
      <HashRouter>
        <App />
      </HashRouter>
    </Api>,
    rootElement
  );
};
