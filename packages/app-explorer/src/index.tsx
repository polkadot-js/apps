// Copyright 2017-2018 @polkadot/app-explorer authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';

import './index.css';

import React from 'react';
import { Route, Switch } from 'react-router';
import classes from '@polkadot/ui-app/util/classes';

import BlockByHash from './BlockByHash';
import Main from './Main';

type Props = BareProps & {
  basePath: string
};

export default class ExplorerApp extends React.Component<Props> {
  render () {
    const { className, style } = this.props;

    return (
      <main
        className={classes('explorer--App', className)}
        style={style}
      >
        <Switch>
          <Route path='/explorer/hash/:hash' component={BlockByHash} />
          <Route component={Main} />
        </Switch>
      </main>
    );
  }
}
