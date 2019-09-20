// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, I18nProps } from '@polkadot/react-components/types';
import { ComponentProps, LocationProps } from './types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';

import React, { useEffect, useState } from 'react';
import { Route, Switch } from 'react-router';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import { HelpOverlay, Tabs } from '@polkadot/react-components';
import { withMulti, withObservable } from '@polkadot/react-api';

import basicMd from './md/basic.md';
import Overview from './Overview';
import translate from './translate';
import Vanity from './Vanity';

interface Props extends AppProps, I18nProps {
  allAccounts?: SubjectInfo;
  location: any;
}

function AccountsApp ({ allAccounts = {}, basePath, location, onStatusChange, t }: Props): React.ReactElement<Props> {
  const [hidden, setHidden] = useState<string[]>(['vanity']);

  useEffect((): void => {
    setHidden(
      Object.keys(allAccounts).length !== 0
        ? []
        : ['vanity']
    );
  }, [allAccounts]);

  const _renderComponent = (Component: React.ComponentType<ComponentProps>): (props: LocationProps) => React.ReactNode => {
    // eslint-disable-next-line react/display-name
    return ({ match }: LocationProps): React.ReactNode => {
      return (
        <Component
          basePath={basePath}
          location={location}
          match={match}
          onStatusChange={onStatusChange}
        />
      );
    };
  };

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
        <Route path={`${basePath}/vanity`} render={_renderComponent(Vanity)} />
        <Route render={_renderComponent(Overview)} />
      </Switch>
    </main>
  );
}

export default withMulti(
  AccountsApp,
  translate,
  withObservable(accountObservable.subject, { propName: 'allAccounts' })
);
