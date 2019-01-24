// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalancesMap } from '@polkadot/api-derive/types';
import { AppProps, I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-api/types';

import React from 'react';
import { AccountId, Balance } from '@polkadot/types';
import { Tabs } from '@polkadot/ui-app/index';
import { withCalls } from '@polkadot/ui-api/index';

import './index.css';

import StakeList from './StakeList';
import Overview from './Overview';
import translate from './translate';

type Actions = 'actions' | 'overview';

type Props = AppProps & ApiProps & I18nProps & {
  balances?: DerivedBalancesMap,
  intentions?: Array<AccountId>,
  session_validators?: Array<AccountId>
};

type State = {
  action: Actions,
  intentions: Array<string>,
  validators: Array<string>
};

const Components: { [index: string]: React.ComponentType<any> } = {
  'overview': Overview,
  'actions': StakeList
};

class App extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      action: 'overview',
      intentions: [],
      validators: []
    };
  }

  static getDerivedStateFromProps ({ session_validators, intentions }: Props): State {
    return {
      intentions: (intentions || []).map((accountId) =>
        accountId.toString()
      ),
      validators: (session_validators || []).map((authorityId) =>
        authorityId.toString()
      )
    } as State;
  }

  render () {
    const { action, intentions, validators } = this.state;
    const { t, balances = {} } = this.props;
    const Component = Components[action];
    const items = [
      {
        name: 'overview',
        text: t('Staking Overview')
      },
      {
        name: 'actions',
        text: t('Account Actions')
      }
    ];

    return (
      <main className='staking--App'>
        <header>
          <Tabs
            activeItem={action}
            items={items}
            onChange={this.onMenuChange}
          />
        </header>
        <Component
          balances={balances}
          balanceArray={this.balanceArray}
          intentions={intentions}
          validators={validators}
        />
      </main>
    );
  }

  private onMenuChange = (action: Actions) => {
    this.setState({ action });
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

export default translate(
  withCalls<Props>(
    'query.session.validators',
    ['query.staking.intentions', { propName: 'intentions' }],
    ['derive.staking.intentionsBalances', { propName: 'balances' }]
  )(App)
);
