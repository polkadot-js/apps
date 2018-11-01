// Copyright 2017-2018 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { RxBalanceMap } from '@polkadot/api-observable/types';

import React from 'react';
import { AccountId } from '@polkadot/types';
import { Tabs } from '@polkadot/ui-app/index';
import { withMulti, withObservable } from '@polkadot/ui-react-rx/with/index';

import './index.css';

import StakeList from './StakeList';
import Overview from './Overview';
import translate from './translate';

type Actions = 'actions' | 'overview';

type Props = I18nProps & {
  basePath: string,
  validatingBalances?: RxBalanceMap,
  stakingIntentions?: Array<AccountId>,
  sessionValidators?: Array<AccountId>
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
          intentions={intentions}
          validators={validators}
        />
      </main>
    );
  }

  onMenuChange = (action: Actions) => {
    this.setState({ action });
  }
}

export default withMulti(
  translate(App),
  withObservable('stakingIntentions'),
  withObservable('sessionValidators'),
  withObservable('validatingBalances', { paramProp: 'stakingIntentions' })
);
