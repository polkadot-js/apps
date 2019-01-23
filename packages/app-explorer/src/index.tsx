// Copyright 2017-2019 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, BareProps } from '@polkadot/ui-app/types';

import './index.css';

import React from 'react';
import { Route, Switch } from 'react-router';

import BlockByHash from './BlockByHash';
import Main from './Main';

type Props = AppProps & BareProps;

export default class ExplorerApp extends React.Component<Props> {
  render () {
    return (
      <main className='explorer--App'>
        <Switch>
          <Route path='/explorer/hash/:hash' component={BlockByHash} />
          <Route component={Main} />
        </Switch>
      </main>
    );
  }
}
