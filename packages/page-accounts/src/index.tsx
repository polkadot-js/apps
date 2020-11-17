// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { Tabs } from '@polkadot/react-components';
import { AppProps as Props } from '@polkadot/react-components/types';
import { useAccounts, useIpfs } from '@polkadot/react-hooks';

import React, { useRef } from 'react';
import { Route, Switch } from 'react-router';
import Accounts from './Accounts';

import basicMd from './md/basic.md';
import { useTranslation } from './translate';
import useCounter from './useCounter';
import Vanity from './Vanity';

export { useCounter };

const HIDDEN_ACC = ['vanity'];

function AccountsTabs ({ basePath }: Props) {
  const { t } = useTranslation();

  const { hasAccounts } = useAccounts();
  const { isIpfs } = useIpfs();

  const itemsRef = useRef([
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

  return <Tabs
    basePath={basePath}
    hidden={(hasAccounts && !isIpfs) ? undefined : HIDDEN_ACC}
    items={itemsRef.current}
  />;
}

function AccountsApp ({ basePath, onStatusChange }: Props): React.ReactElement<Props> {
  return <Switch>
    <Route path={`${basePath}/vanity`}>
      <Vanity
        basePath={basePath}
        onStatusChange={onStatusChange}
      />
    </Route>
    <Route>
      <Accounts
        basePath={basePath}
        onStatusChange={onStatusChange}
      />
    </Route>
  </Switch>;
}

export const Component = React.memo(AccountsApp);
export const TabsComponent = React.memo(AccountsTabs);
export const helpText = basicMd as string;
