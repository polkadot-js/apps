// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, I18nProps } from '@polkadot/ui-app/types';
import { ComponentProps, LocationProps } from './types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';

import React from 'react';
import { Route, Switch } from 'react-router';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import { HelpOverlay, Tabs } from '@polkadot/ui-app';
import { TabItem } from '@polkadot/ui-app/Tabs';
import { withMulti, withObservable } from '@polkadot/ui-api';

import './index.css';

import basicMd from './md/basic.md';
import Overview from './Overview';
import translate from './translate';
import Vanity from './Vanity';

type Props = AppProps & I18nProps & {
  allAccounts?: SubjectInfo
};

type State = {
  hidden: Array<string>,
  tabs: Array<TabItem>
};

class AccountsApp extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    const { allAccounts = {}, t } = props;
    const baseState = Object.keys(allAccounts).length !== 0
      ? AccountsApp.showTabsState()
      : AccountsApp.hideTabsState();

    this.state = {
      ...baseState,
      tabs: [
        {
          name: 'overview',
          text: t('My accounts')
        },
        {
          name: 'vanity',
          text: t('Vanity address')
        }
      ]
    };
  }

  static showTabsState () {

    return {
      hidden: []
    };
  }

  static hideTabsState () {
    // Hide vanity as well - since the route order and matching changes, the
    // /create/:seed route become problematic, so don't allow that option
    return {
      hidden: ['vanity']
    };
  }

  static getDerivedStateFromProps ({ allAccounts = {} }: Props, { hidden }: State) {
    const hasAddresses = Object.keys(allAccounts).length !== 0;

    if (hidden.length === 0) {
      return hasAddresses
        ? null
        : AccountsApp.hideTabsState();
    }

    return hasAddresses
      ? AccountsApp.showTabsState()
      : null;
  }

  render () {
    const { basePath } = this.props;
    const { hidden, tabs } = this.state;

    return (
      <main className='accounts--App'>
        <HelpOverlay md={basicMd} />
        <header>
          <Tabs
            basePath={basePath}
            hidden={hidden}
            items={tabs}
          />
        </header>
        <Switch>
          <Route path={`${basePath}/vanity`} render={this.renderComponent(Vanity)} />
          <Route render={this.renderComponent(Overview)} />
        </Switch>
      </main>
    );
  }

  private renderComponent (Component: React.ComponentType<ComponentProps>) {
    return ({ match }: LocationProps) => {
      const { basePath, location, onStatusChange } = this.props;

      return (
        <Component
          basePath={basePath}
          location={location}
          match={match}
          onStatusChange={onStatusChange}
        />
      );
    };
  }
}

export default withMulti(
  AccountsApp,
  translate,
  withObservable(accountObservable.subject, { propName: 'allAccounts' })
);
