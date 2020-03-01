// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps as Props } from '@polkadot/react-components/types';
import { ComponentProps } from './types';

import React, { useEffect, useMemo, useState } from 'react';
import { Route, Switch } from 'react-router';
import { useAccounts } from '@polkadot/react-hooks';
import { HelpOverlay, Tabs } from '@polkadot/react-components';

import basicMd from './md/basic.md';
import Overview from './Overview';
import { useTranslation } from './translate';
import Vanity from './Vanity';

export default function AccountsApp ({ basePath, onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { hasAccounts } = useAccounts();
  const [hidden, setHidden] = useState<string[]>(['vanity']);
  const items = useMemo(() => [
    {
      isRoot: true,
      name: 'overview',
      text: t('My accounts')
    },
    {
      name: 'vanity',
      text: t('Vanity address')
    }
  ], [t]);

  useEffect((): void => {
    setHidden(
      hasAccounts
        ? []
        : ['vanity']
    );
  }, [hasAccounts]);

  const _renderComponent = (Component: React.ComponentType<ComponentProps>): React.ReactNode => (
    <Component
      basePath={basePath}
      onStatusChange={onStatusChange}
    />
  );

  return (
    <main className='accounts--App'>
      <HelpOverlay md={basicMd} />
      <header>
        <Tabs
          basePath={basePath}
          hidden={hidden}
          items={items}
        />
      </header>
      <Switch>
        <Route path={`${basePath}/vanity`}>{_renderComponent(Vanity)}</Route>
        <Route>{_renderComponent(Overview)}</Route>
      </Switch>
    </main>
  );
}
