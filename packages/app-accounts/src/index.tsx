// Copyright 2017-2019 @polkadot/app-accounts authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, I18nProps } from '@polkadot/ui-app/types';
import { TabItem } from '@polkadot/ui-app/Tabs';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { ComponentProps, LocationProps } from './types';

import './index.css';

import React from 'react';
import { Route, Switch } from 'react-router';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';
import { Tabs } from '@polkadot/ui-app';
import { withMulti, withObservable } from '@polkadot/ui-api';

import Creator from './Creator';
import Editor from './Editor';
import Restore from './Restore';
import Vanity from './Vanity';
import translate from './translate';

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
      ? AccountsApp.showEditState()
      : AccountsApp.hideEditState();

    this.state = {
      ...baseState,
      tabs: [
        {
          name: 'edit',
          text: t('Edit account')
        },
        {
          hasParams: true,
          name: 'create',
          text: t('Create account')
        },
        {
          name: 'restore',
          text: t('Restore account')
        },
        {
          name: 'vanity',
          text: t('Vanity address')
        }
      ]
    };
  }

  static showEditState () {
    return {
      hidden: []
    };
  }

  static hideEditState () {
    // Hide vanity as well - since the route order and matching changes, the
    // /create/:seed route become problematic, so don't allow that option
    return {
      hidden: ['edit', 'vanity']
    };
  }

  static getDerivedStateFromProps ({ allAccounts = {} }: Props, { hidden }: State) {
    const hasAddresses = Object.keys(allAccounts).length !== 0;

    if (hidden.length === 0) {
      return hasAddresses
        ? null
        : AccountsApp.hideEditState();
    }

    return hasAddresses
      ? AccountsApp.showEditState()
      : null;
  }

  render () {
    const { basePath } = this.props;
    const { hidden, tabs } = this.state;
    const renderCreator = this.renderComponent(Creator);

    return (
      <main className='accounts--App'>
        <header>
          <Tabs
            basePath={basePath}
            hidden={hidden}
            items={tabs}
          />
        </header>
        <Switch>
          <Route path={`${basePath}/create/:seed`} render={renderCreator} />
          <Route path={`${basePath}/create`} render={renderCreator} />
          <Route path={`${basePath}/restore`} render={this.renderComponent(Restore)} />
          <Route path={`${basePath}/vanity`} render={this.renderComponent(Vanity)} />
          <Route
            render={
              hidden.includes('edit')
                ? renderCreator
                : this.renderComponent(Editor)
            }
          />
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
