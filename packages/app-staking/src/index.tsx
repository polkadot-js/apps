// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalancesMap } from '@polkadot/api-derive/types';
import { AppProps, I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { ComponentProps, Nominators, RecentlyOffline, RecentlyOfflineMap } from './types';

import React from 'react';
import { Route, Switch } from 'react-router';
import { AccountId, Option } from '@polkadot/types';
import { HelpOverlay } from '@polkadot/ui-app';
import Tabs, { TabItem } from '@polkadot/ui-app/Tabs';
import { withCalls, withMulti, withObservable } from '@polkadot/ui-api';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';

import './index.css';

import basicMd from './md/basic.md';
import Accounts from './Accounts';
import Overview from './Overview';
import translate from './translate';

type Props = AppProps & ApiProps & I18nProps & {
  allAccounts?: SubjectInfo,
  balances?: DerivedBalancesMap,
  session_validators?: Array<AccountId>,
  staking_controllers?: [Array<AccountId>, Array<Option<AccountId>>],
  staking_nominators?: [Array<AccountId>, Array<Array<AccountId>>],
  staking_recentlyOffline?: RecentlyOffline
};

type State = {
  controllers: Array<string>,
  nominators: Nominators,
  recentlyOffline: RecentlyOfflineMap,
  stashes: Array<string>,
  tabs: Array<TabItem>,
  validators: Array<string>
};

class App extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    const { t } = props;

    this.state = {
      controllers: [],
      nominators: {},
      recentlyOffline: {},
      stashes: [],
      tabs: [
        {
          name: 'overview',
          text: t('Staking Overview')
        },
        {
          name: 'actions',
          text: t('Account Actions')
        }
      ],
      validators: []
    };
  }

  static getDerivedStateFromProps ({ staking_controllers = [[], []], session_validators = [], staking_nominators = [[], []], staking_recentlyOffline = [] }: Props): State {
    return {
      controllers: staking_controllers[1].filter((optId) => optId.isSome).map((accountId) =>
        accountId.unwrap().toString()
      ),
      nominators: staking_nominators[0].reduce((result, accountId, index) => {
        result[accountId.toString()] = staking_nominators[1][index].map((accountId) =>
          accountId.toString()
        );

        return result;
      }, {} as Nominators),
      stashes: staking_controllers[0].map((accountId) => accountId.toString()),
      validators: session_validators.map((authorityId) =>
        authorityId.toString()
      ),
      recentlyOffline: staking_recentlyOffline.reduce(
        (result, [accountId, blockNumber, count]) => {
          const account = accountId.toString();

          if (!result[account]) {
            result[account] = [];
          }

          result[account].push({
            blockNumber,
            count
          });

          return result;
        }, {} as RecentlyOfflineMap)
    } as State;
  }

  render () {
    const { allAccounts, basePath } = this.props;
    const { tabs } = this.state;
    const hidden = !allAccounts || Object.keys(allAccounts).length === 0
      ? ['actions']
      : [];

    return (
      <main className='staking--App'>
        <HelpOverlay md={basicMd} />
        <header>
          <Tabs
            basePath={basePath}
            hidden={hidden}
            items={tabs}
          />
        </header>
        <Switch>
          <Route path={`${basePath}/actions`} render={this.renderComponent(Accounts)} />
          <Route render={this.renderComponent(Overview)} />
        </Switch>
      </main>
    );
  }

  private renderComponent (Component: React.ComponentType<ComponentProps>) {
    return (): React.ReactNode => {
      const { controllers, nominators, recentlyOffline, stashes, validators } = this.state;
      const { balances = {} } = this.props;

      return (
        <Component
          balances={balances}
          controllers={controllers}
          nominators={nominators}
          recentlyOffline={recentlyOffline}
          stashes={stashes}
          validators={validators}
        />
      );
    };
  }
}

export default withMulti(
  App,
  translate,
  withCalls<Props>(
    'derive.staking.controllers',
    'query.session.validators',
    'query.staking.nominators',
    'query.staking.recentlyOffline'
  ),
  withObservable(accountObservable.subject, { propName: 'allAccounts' })
);
