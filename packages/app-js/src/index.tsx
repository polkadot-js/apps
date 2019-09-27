// Copyright 2017-2019 @polkadot/app-js authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, BareProps } from '@polkadot/react-components/types';

import React from 'react';
import { Route, Switch } from 'react-router';

import Playground from './Playground';

interface Props extends AppProps, BareProps {}

export default function AppJs ({ basePath }: Props): React.ReactElement<Props> {
  return (
    <Switch>
      <Route path={`${basePath}/share/:base64`} component={Playground} />
      <Route component={Playground} />
    </Switch>
  );
}
