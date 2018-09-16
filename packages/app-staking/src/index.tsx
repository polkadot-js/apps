// Copyright 2017-2018 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { RxBalanceMap } from '@polkadot/ui-react-rx/ApiObservable/types';

import React from 'react';
import Tabs from '@polkadot/ui-app/Tabs';
import withObservable from '@polkadot/ui-react-rx/with/observable';
import withMulti from '@polkadot/ui-react-rx/with/multi';

import './index.css';

import StakeList from './StakeList';
import Overview from './Overview';
import translate from './translate';

type Actions = 'actions' | 'overview';

type Props = I18nProps & {
  basePath: string,
  validatingBalances?: RxBalanceMap,
  stakingIntentions?: Array<string>,
  sessionValidators?: Array<string>
};

type State = {
  action: Actions
};

// FIXME React-router would probably be the best route, not home-grown
const Components: { [index: string]: React.ComponentType<any> } = {
  'overview': Overview,
  'actions': StakeList
};

class App extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      action: 'overview'
    };
  }

  render () {
    const { action } = this.state;
    const { sessionValidators = [], stakingIntentions = [], t, validatingBalances = {} } = this.props;
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
          intentions={stakingIntentions}
          validators={sessionValidators}
        />
      </main>
    );
  }

  onMenuChange = (action: Actions) => {
    this.setState({ action });
  }
}

export default withMulti(
  App,
  translate,
  withObservable('stakingIntentions'),
  withObservable('sessionValidators'),
  withObservable('validatingBalances', { paramProp: 'stakingIntentions' })
);
