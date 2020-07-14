// Copyright 2017-2020 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps } from '@polkadot/react-components/types';
import { ComponentProps } from './types';

import React, { useEffect, useMemo, useState } from 'react';
import { Route, Switch } from 'react-router';
import { useAccounts } from '@polkadot/react-hooks';
import { HelpOverlay, Tabs } from '@polkadot/react-components';

import basicMd from './md/basic.md';
import Overview from './Overview';
import AddressBook from '../../app-address-book/src/Overview'
import { useTranslation } from './translate';
import {SubjectInfo} from "@polkadot/ui-keyring/observable/types";

interface Props extends AppProps {
  allAddresses?: SubjectInfo;
  location: any;
}

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
      name: 'addressBook',
      text: t('Address book')
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

  const _renderAddressBookComponent = (): React.ReactNode => (
  <AddressBook
    basePath={basePath}
    location={location}
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
        <Route path={`${basePath}/addressBook`}>{_renderAddressBookComponent()}</Route>
        <Route>{_renderComponent(Overview)}</Route>
      </Switch>
    </main>
  );
}
