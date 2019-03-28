// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalancesMap } from '@polkadot/api-derive/types';
import { AppProps, I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';
import { SubjectInfo } from '@polkadot/ui-keyring/observable/types';
import { ComponentProps, Nominators } from './types';

import React from 'react';
import { Route, Switch } from 'react-router';
import { AccountId, Balance, Option } from '@polkadot/types';
import Tabs, { TabItem } from '@polkadot/ui-app/Tabs';
import { withCalls, withMulti, withObservable } from '@polkadot/ui-api';
import accountObservable from '@polkadot/ui-keyring/observable/accounts';

import './index.css';

import StakeList from './StakeList';
import Overview from './Overview';
import translate from './translate';

type Props = AppProps & ApiProps & I18nProps & {
  allAccounts?: SubjectInfo,
  balances?: DerivedBalancesMap,
  session_validators?: Array<AccountId>,
  staking_controllers?: [Array<AccountId>, Array<Option<AccountId>>],
  staking_nominators?: [Array<AccountId>, Array<Array<AccountId>>]
};

type State = {
  intentions: Array<string>,
  nominators: Nominators,
  tabs: Array<TabItem>,
  validators: Array<string>
};

class App extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    const { t } = props;

    this.state = {
      intentions: [],
      nominators: {},
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

  static getDerivedStateFromProps ({ staking_controllers = [[], []], session_validators = [], staking_nominators = [[], []] }: Props): State {
    return {
      intentions: staking_controllers[1].filter((optId) => optId.isSome).map((accountId) =>
        accountId.unwrap().toString()
      ),
      nominators: staking_nominators[0].reduce((result, accountId, index) => {
        result[accountId.toString()] = staking_nominators[1][index].map((accountId) =>
          accountId.toString()
        );

        return result;
      }, {} as Nominators),
      validators: session_validators.map((authorityId) =>
        authorityId.toString()
      )
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
        <header>
          <Tabs
            basePath={basePath}
            hidden={hidden}
            items={tabs}
          />
        </header>
        <Switch>
          <Route path={`${basePath}/actions`} render={this.renderComponent(StakeList)} />
          <Route render={this.renderComponent(Overview)} />
        </Switch>
      </main>
    );
  }

  private renderComponent (Component: React.ComponentType<ComponentProps>) {
    return (): React.ReactNode => {
      const { intentions, nominators, validators } = this.state;
      const { balances = {} } = this.props;

      return (
        <Component
          balances={balances}
          balanceArray={this.balanceArray}
          intentions={intentions}
          nominators={nominators}
          validators={validators}
        />
      );
    };
  }

  private balanceArray = (_address: AccountId | string): Array<Balance> | undefined => {
    const { balances = {} } = this.props;

    if (!_address) {
      return undefined;
    }

    const address = _address.toString();

    return balances[address]
      ? [
        balances[address].stakingBalance,
        balances[address].nominatedBalance
      ]
      : undefined;
  }
}

export default withMulti(
  App,
  translate,
  withCalls<Props>(
    'derive.staking.controllers',
    'query.session.validators',
    'query.staking.nominators',
    ['derive.staking.intentionsBalances', { propName: 'balances' }]
  ),
  withObservable(accountObservable.subject, { propName: 'allAccounts' })
);
