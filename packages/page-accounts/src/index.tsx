// Copyright 2017-2023 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { AppProps as Props } from '@polkadot/react-components/types';

import React, { useRef } from 'react';
import { Route, Switch } from 'react-router';

import { Tabs } from '@polkadot/react-components';
import { useAccounts, useIpfs } from '@polkadot/react-hooks';

import Accounts from './Accounts/index.js';
import Vanity from './Vanity/index.js';
import { useTranslation } from './translate.js';
import useCounter from './useCounter.js';

export { useCounter };

const HIDDEN_ACC = ['vanity'];

function AccountsApp ({ basePath, onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { hasAccounts } = useAccounts();
  const { isIpfs } = useIpfs();

  const tabsRef = useRef([
    {
      isRoot: true,
      name: 'overview',
      text: t<string>('My accounts')
    },
    {
      name: 'vanity',
      text: t<string>('Vanity generator')
    }
  ]);

  return (
    <main className='accounts--App'>
      <Tabs
        basePath={basePath}
        hidden={(hasAccounts && !isIpfs) ? undefined : HIDDEN_ACC}
        items={tabsRef.current}
      />
      <Switch>
        <Route path={`${basePath}/vanity`}>
          <Vanity onStatusChange={onStatusChange} />
        </Route>
        <Route>
          <Accounts onStatusChange={onStatusChange} />
        </Route>
      </Switch>
    </main>
  );
}

export default React.memo(AccountsApp);
