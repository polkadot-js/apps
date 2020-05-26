// Copyright 2017-2020 @polkadot/app-toolbox authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps as Props } from '@polkadot/react-components/types';

import React, { useMemo } from 'react';
import { Route, Switch } from 'react-router';
import Tabs from '@polkadot/react-components/Tabs';
import { useAccounts } from '@polkadot/react-hooks';

import Hash from './Hash';
import Rpc from './Rpc';
import Sign from './Sign';
import Verify from './Verify';
import { useTranslation } from './translate';

function ToolboxApp ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { hasAccounts } = useAccounts();
  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'rpc',
      text: t<string>('RPC calls')
    },
    {
      name: 'hash',
      text: t<string>('Hash data')
    },
    {
      name: 'sign',
      text: t<string>('Sign message')
    },
    {
      name: 'verify',
      text: t<string>('Verify signature')
    }
  ], [t]);

  return (
    <main className='toolbox--App'>
      <header>
        <Tabs
          basePath={basePath}
          hidden={
            hasAccounts
              ? []
              : ['sign', 'verify']
          }
          items={items}
        />
      </header>
      <Switch>
        <Route path={`${basePath}/hash`}><Hash /></Route>
        <Route path={`${basePath}/sign`}><Sign /></Route>
        <Route path={`${basePath}/verify`}><Verify /></Route>
        <Route><Rpc /></Route>
      </Switch>
    </main>
  );
}

export default React.memo(ToolboxApp);
