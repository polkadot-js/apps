// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

require('./styles');

const React = require('react');
const ReactDOM = require('react-dom');
const { HashRouter } = require('react-router-dom');
const Api = require('@polkadot/rx-react/Api');

const I18n = require('../I18n');

module.exports = function createApp (App: React$ComponentType<*>, root: string = 'root'): void {
  ReactDOM.render(
    <Api>
      <I18n>
        <HashRouter>
          <App />
        </HashRouter>
      </I18n>
    </Api>,
    // flowlint-next-line unclear-type:off
    ((document.getElementById(root): any): Element)
  );
};
