// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AppProps, I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { ComponentProps, RecentlyOffline, RecentlyOfflineMap } from './types';

import React from 'react';
import { Route, Switch } from 'react-router';
import { AccountId, Option } from '@polkadot/types';
import { HelpOverlay } from '@polkadot/ui-app';
import Tabs, { TabItem } from '@polkadot/ui-app/Tabs';
import { withCalls, withMulti, withObservable } from '@polkadot/ui-api';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';

import './index.css';

import Accounts from './Actions/Accounts';
import basicMd from './md/basic.md';
import Overview from './Overview';
import translate from './translate';

type Props = AppProps & ApiProps & I18nProps & {
  allAccounts?: SubjectInfo,
  allStashesAndControllers?: [AccountId[], Option<AccountId>[]],
  currentValidatorsControllersV1OrStashesV2?: AccountId[],
  staking_recentlyOffline?: RecentlyOffline
};

type State = {
  allControllers: string[],
  allStashes: string[],
  currentValidatorsControllersV1OrStashesV2: string[],
  recentlyOffline: RecentlyOfflineMap,
  tabs: TabItem[]
};

class App extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    const { t } = props;

    this.state = {
      allControllers: [],
      allStashes: [],
      currentValidatorsControllersV1OrStashesV2: [],
      recentlyOffline: {},
      tabs: [
        {
          isRoot: true,
          name: 'overview',
          text: t('Staking overview')
        },
        {
          name: 'actions',
          text: t('Account actions')
        }
      ]
    };
  }

  static getDerivedStateFromProps ({ allStashesAndControllers = [[], []], currentValidatorsControllersV1OrStashesV2 = [], staking_recentlyOffline = [] }: Props): State {
    return {
      allControllers: allStashesAndControllers[1].filter((optId) => optId.isSome).map((accountId) =>
        accountId.unwrap().toString()
      ),
      allStashes: allStashesAndControllers[0].map((accountId) => accountId.toString()),
      currentValidatorsControllersV1OrStashesV2: currentValidatorsControllersV1OrStashesV2.map((authorityId) =>
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
      const { allControllers, recentlyOffline, allStashes, currentValidatorsControllersV1OrStashesV2 } = this.state;
      const { allAccounts } = this.props;

      if (!allAccounts) {
        return null;
      }

      return (
        <Component
          allAccounts={allAccounts}
          allControllers={allControllers}
          allStashes={allStashes}
          currentValidatorsControllersV1OrStashesV2={currentValidatorsControllersV1OrStashesV2}
          recentlyOffline={recentlyOffline}
        />
      );
    };
  }
}

export default withMulti(
  App,
  translate,
  withCalls<Props>(
    ['derive.staking.controllers', { propName: 'allStashesAndControllers' }],
    ['query.session.validators', { propName: 'currentValidatorsControllersV1OrStashesV2' }],
    'query.staking.recentlyOffline'
  ),
  withObservable(accountObservable.subject, { propName: 'allAccounts' })
);
