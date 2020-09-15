// Copyright 2017-2020 @polkadot/app-rpc authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps as Props } from '@polkadot/react-components/types';

import React, { useRef } from 'react';
import { Route, Switch } from 'react-router';
import Tabs from '@polkadot/react-components/Tabs';

import Rpc from './Rpc';
import { useTranslation } from './translate';

function RpcApp ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const itemsRef = useRef([
    {
      isRoot: true,
      name: 'rpc',
      text: t<string>('RPC calls')
    }
  ]);

  return (
    <main className='toolbox--App'>
      <header>
        <Tabs
          basePath={basePath}
          items={itemsRef.current}
        />
      </header>
      <Switch>
        <Route><Rpc /></Route>
      </Switch>
    </main>
  );
}

export default React.memo(RpcApp);
