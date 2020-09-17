// Copyright 2017-2020 @polkadot/app-rpc authors & contributors
// SPDX-License-Identifier: Apache-2.0

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
