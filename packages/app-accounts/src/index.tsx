// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, I18nProps } from '@polkadot/react-components/types';
import { ComponentProps } from './types';

import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router';
import { useAccounts } from '@polkadot/react-hooks';
import { HelpOverlay, Tabs } from '@polkadot/react-components';

import basicMd from './md/basic.md';
import Overview from './Overview';
import translate from './translate';
import Vanity from './Vanity';

interface Props extends AppProps, I18nProps {
}

function AccountsApp ({ basePath, onStatusChange, t }: Props): React.ReactElement<Props> {
  const { hasAccounts } = useAccounts();
  const [hidden, setHidden] = useState<string[]>(['vanity']);

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
          items={[
            {
              isRoot: true,
              name: 'overview',
              text: t('My accounts')
            },
            {
              name: 'vanity',
              text: t('Vanity address')
            }
          ]}
        />
      </header>
      <Switch>
        <Route path={`${basePath}/vanity`}>{_renderComponent(Vanity)}</Route>
        <Route>{_renderComponent(Overview)}</Route>
      </Switch>
    </main>
  );
}

export default translate(AccountsApp);
