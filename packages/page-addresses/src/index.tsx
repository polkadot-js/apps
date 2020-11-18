// Copyright 2017-2020 @polkadot/app-addresses authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { AppProps as Props } from '@polkadot/react-components/types';

import React, { useRef } from 'react';
import { Route, Switch } from 'react-router';
import { Tabs } from '@polkadot/react-components';

import { useTranslation } from './translate';
import Contacts from './Contacts';

function AddressTabs ({ basePath }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const itemsRef = useRef([
    {
      isRoot: true,
      name: 'contacts',
      text: t<string>('My contacts')
    }
  ]);

  return (
    <Tabs
      basePath={basePath}
      items={itemsRef.current}
    />
  );
}

function AddressesApp ({ basePath, onStatusChange }: Props): React.ReactElement<Props> {
  return (
    <Switch>
      <Route>
        <Contacts
          basePath={basePath}
          onStatusChange={onStatusChange}
        />
      </Route>
    </Switch>
  );
}

export const Component = React.memo(AddressesApp);
export const TabsComponent = React.memo(AddressTabs);
