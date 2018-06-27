// Copyright 2017-2018 @polkadot/ui-app authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { ProviderInterface } from '@polkadot/api-provider/types';
import { RxApiInterface } from '@polkadot/api-rx/types';
import { BareProps } from './types';

import './i18n';
import './styles';

import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter } from 'react-router-dom';

import Api from '@polkadot/ui-react-rx/Api';

type Props = BareProps & {
  api?: RxApiInterface,
  provider?: ProviderInterface,
  url?: string
};

export default function createApp (App: React.ComponentType<BareProps>, { api, className, provider, style, url }: Props = {}, rootId: string = 'root'): void {
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
}
