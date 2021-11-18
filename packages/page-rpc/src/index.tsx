// Copyright 2017-2021 @polkadot/app-rpc authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AppProps as Props } from '@polkadot/react-components/types';

import React, { useRef } from 'react';
import { Route, Switch } from 'react-router';

import { Tabs } from '@polkadot/react-components';

import Rpc from './Rpc';
import { useTranslation } from './translate';

function RpcApp ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const itemsRef = useRef([
    {
      isRoot: true,
      name: 'rpc',
      text: t<string>('Submission')
    }
  ]);

  return (
    <main className='toolbox--App'>
      <Tabs
        basePath={basePath}
        items={itemsRef.current}
      />
      <Switch>
        <Route><Rpc /></Route>
      </Switch>
    </main>
  );
}

export default React.memo(RpcApp);
