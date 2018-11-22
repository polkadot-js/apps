// Copyright 2017-2018 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ActionStatus } from '@polkadot/ui-app/Status/types';
import { RxBalanceMap } from '@polkadot/api-observable/types';

import React from 'react';
import { AccountId, Balance } from '@polkadot/types';
import { Tabs } from '@polkadot/ui-app/index';
import { withMulti, withObservable } from '@polkadot/ui-react-rx/with/index';

import './index.css';

import StakeList from './StakeList';
import Overview from './Overview';
import translate from './translate';

type Actions = 'actions' | 'overview';

type Props = I18nProps & {
  basePath: string,
  onStatusChange: (status: ActionStatus) => void,
  stakingIntentions?: Array<AccountId>,
  sessionValidators?: Array<AccountId>,
  validatingBalances?: RxBalanceMap
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

  static getDerivedStateFromProps ({ sessionValidators = [], stakingIntentions = [] }: Props): State {
    return {
      intentions: stakingIntentions.map((accountId) =>
        accountId.toString()
      ),
      validators: sessionValidators.map((authorityId) =>
        authorityId.toString()
      )
    } as State;
  }

  render () {
    const { action, intentions, validators } = this.state;
    const { t, validatingBalances = {} } = this.props;
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
          balances={validatingBalances}
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
    const { validatingBalances = {} } = this.props;

    if (!_address) {
      return undefined;
    }

    const address = _address.toString();

    return validatingBalances[address]
      ? [validatingBalances[address].stakingBalance, validatingBalances[address].nominatedBalance]
      : undefined;
  }
}

export default withMulti(
  App,
  translate,
  withObservable('stakingIntentions'),
  withObservable('sessionValidators'),
  withObservable('validatingBalances', { paramProp: 'stakingIntentions' })
);
