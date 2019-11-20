// Copyright 2017-2019 @polkadot/app-address-book authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, I18nProps } from '@polkadot/react-components/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { ComponentProps } from './types';

import React from 'react';
import { Route, Switch } from 'react-router';
import { HelpOverlay } from '@polkadot/react-components';
import Tabs from '@polkadot/react-components/Tabs';

import basicMd from './md/basic.md';
import Overview from './Overview';
import translate from './translate';

interface Props extends AppProps, I18nProps {
  allAddresses?: SubjectInfo;
  location: any;
}

function AddressBookApp ({ basePath, onStatusChange, t }: Props): React.ReactElement<Props> {
  const _renderComponent = (Component: React.ComponentType<ComponentProps>): () => React.ReactNode => {
    // eslint-disable-next-line react/display-name
    return (): React.ReactNode =>
      <Component
        basePath={basePath}
        location={location}
        onStatusChange={onStatusChange}
      />;
  };

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
        <Route render={_renderComponent(Overview)} />
      </Switch>
    </main>
  );
}

export default translate(AddressBookApp);
