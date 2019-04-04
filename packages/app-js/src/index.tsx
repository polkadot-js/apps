// Copyright 2017-2019 @polkadot/app-js authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, BareProps } from '@polkadot/ui-app/types';

import React from 'react';
import { Route, Switch } from 'react-router';

import './index.css';
import Playground from './Playground';

type Props = AppProps & BareProps;

class AppJs extends React.PureComponent<Props> {
  render () {
    const { basePath } = this.props;

    return (
      <Switch>
        <Route path={`${basePath}/share/:base64`} component={Playground} />
        <Route component={Playground} />
      </Switch>
    );
  }
}

export default AppJs;
