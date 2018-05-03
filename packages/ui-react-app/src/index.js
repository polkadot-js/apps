// Copyright 2017-2018 Jaco Greeff
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.
// @flow

import type { ProviderInterface } from '@polkadot/api-provider/types';
import type { RxApiInterface } from '@polkadot/rx-api/types';
import type { BareProps } from './types';

type Props = BareProps & {
  api?: RxApiInterface,
  provider?: ProviderInterface,
  url?: string
}

require('./i18n');
require('./styles');

const React = require('react');
const ReactDOM = require('react-dom');
const { HashRouter } = require('react-router-dom');
const Api = require('@polkadot/rx-react/Api');

module.exports = function createApp (App: React$ComponentType<BareProps>, { api, className, provider, style, url }: Props = {}, rootId: string = 'root'): void {
  const rootElement = document.getElementById(rootId);

  if (!rootElement) {
    throw new Error(`Unable to find element with id '${rootId}'`);
  }

  ReactDOM.render(
    <Api
      api={api}
      provider={provider}
      url={url}
    >
      <HashRouter>
        <App
          className={className}
          style={style}
        />
      </HashRouter>
    </Api>,
    rootElement
  );
};
