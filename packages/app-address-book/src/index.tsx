// Copyright 2017-2020 @polkadot/app-address-book authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps } from '@polkadot/react-components/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';

import React from 'react';
import { Route, Switch } from 'react-router';
import { HelpOverlay } from '@polkadot/react-components';
import Tabs from '@polkadot/react-components/Tabs';

import basicMd from './md/basic.md';
import Overview from './Overview';
import { useTranslation } from './translate';

interface Props extends AppProps {
  allAddresses?: SubjectInfo;
  location: any;
}

export default function AddressBookApp ({ basePath, onStatusChange }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  return (
    <main className='address-book--App'>
      <HelpOverlay md={basicMd} />
      <header>
        <Tabs
          basePath={basePath}
          items={[
            {
              isRoot: true,
              name: 'overview',
              text: t('My contacts')
            }
          ]}
        />
      </header>
      <Switch>
        <Route>
          <Overview
            basePath={basePath}
            location={location}
            onStatusChange={onStatusChange}
          />
        </Route>
      </Switch>
    </main>
  );
}
