// Copyright 2017-2019 @polkadot/app-toolbox authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { Route, Switch } from 'react-router';
import Tabs from '@polkadot/react-components/Tabs';
import { useAccounts } from '@polkadot/react-hooks';

import Hash from './Hash';
import Rpc from './Rpc';
import Sign from './Sign';
import Verify from './Verify';
import translate from './translate';

interface Props extends AppProps, I18nProps {
}

function ToolboxApp ({ basePath, t }: Props): React.ReactElement<Props> {
  const { hasAccounts } = useAccounts();
  const tabs = [
    {
      isRoot: true,
      name: 'rpc',
      text: t('RPC calls')
    },
    {
      name: 'hash',
      text: t('Hash data')
    },
    {
      name: 'sign',
      text: t('Sign message')
    },
    {
      name: 'verify',
      text: t('Verify signature')
    }
  ];
  const filteredTabs = hasAccounts
    ? tabs
    : tabs.filter(({ name }): boolean => !['sign', 'verify'].includes(name));

  return (
    <main className='toolbox--App'>
      <header>
        <Tabs
          basePath={basePath}
          items={filteredTabs}
        />
      </header>
      <Switch>
        <Route path={`${basePath}/hash`} component={Hash} />
        <Route path={`${basePath}/sign`} component={Sign} />
        <Route path={`${basePath}/verify`} component={Verify} />
        <Route component={Rpc} />
      </Switch>
    </main>
  );
}

export default translate(ToolboxApp);
