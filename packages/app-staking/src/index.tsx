// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ActionStatus } from '@polkadot/ui-app/Status/types';
import { DerivedBalancesMap } from '@polkadot/ui-api/derive/types';

import React from 'react';
import { AccountId, Balance } from '@polkadot/types';
import { Tabs } from '@polkadot/ui-app/index';
import { withCall, withMulti } from '@polkadot/ui-api/index';

import './index.css';

import StakeList from './StakeList';
import Overview from './Overview';
import translate from './translate';

type Actions = 'actions' | 'overview';

type Props = I18nProps & {
  basePath: string,
  onStatusChange: (status: ActionStatus) => void,
  query_staking_intentions?: Array<AccountId>,
  query_session_validators?: Array<AccountId>,
  derive_balances_validatingBalances?: DerivedBalancesMap
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

  static getDerivedStateFromProps ({ query_session_validators, query_staking_intentions }: Props): State {
    return {
      intentions: (query_staking_intentions || []).map((accountId) =>
        accountId.toString()
      ),
      validators: (query_session_validators || []).map((authorityId) =>
        authorityId.toString()
      )
    } as State;
  }

  render () {
    const { action, intentions, validators } = this.state;
    const { t, derive_balances_validatingBalances = {} } = this.props;
    const Component = Components[action];
    const items = [
      {
        name: 'overview',
        text: t('app.overview', { defaultValue: 'Staking Overview' })
      },
      {
        name: 'actions',
        text: t('app.actions', { defaultValue: 'Account Actions' })
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
          balances={derive_balances_validatingBalances}
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
    const { derive_balances_validatingBalances = {} } = this.props;

    if (!_address) {
      return undefined;
    }

    const address = _address.toString();

    return derive_balances_validatingBalances[address]
      ? [
        derive_balances_validatingBalances[address].stakingBalance,
        derive_balances_validatingBalances[address].nominatedBalance
      ]
      : undefined;
  }
}

export default withMulti(
  App,
  translate,
  withCall('query.staking.intentions'),
  withCall('query.session.validators'),
  withCall('derive.balances.validatingBalances', { paramProp: 'stakingIntentions' })
);
