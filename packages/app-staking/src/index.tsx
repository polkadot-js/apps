// Copyright 2017-2018 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { ExtendedBalanceMap } from '@polkadot/ui-react-rx/types';

import React from 'react';
import Page from '@polkadot/ui-app/Page';
import Navigation from '@polkadot/ui-app/Navigation';
import Button from '@polkadot/ui-app/Button';
import classes from '@polkadot/ui-app/util/classes';
import withObservable from '@polkadot/ui-react-rx/with/observable';
import withMulti from '@polkadot/ui-react-rx/with/multi';

import './index.css';

import StakeList from './StakeList';
import Overview from './Overview';
import translate from './translate';

type Actions = 'actions' | 'overview';

type Props = I18nProps & {
  validatingBalances?: ExtendedBalanceMap,
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
    const Component = Components[action];
    const { className, sessionValidators = [], stakingIntentions = [], style, t, validatingBalances = {} } = this.props;

    return (
      <Page
        className={classes('staking--App', className)}
        style={style}
      >
        <Navigation>
          <Button.Group className='staking--App-navigation'>
            <Button
              isPrimary={action === 'overview'}
              onClick={this.selectOverview}
              text={t('app.overview', {
                defaultValue: 'Staking Overview'
              })}
            />
            <Button.Or />
            <Button
              isPrimary={action === 'actions'}
              onClick={this.selectActions}
              text={t('app.actions', {
                defaultValue: 'Account Actions'
              })}
            />
          </Button.Group>
        </Navigation>
        <Component
          balances={validatingBalances}
          intentions={stakingIntentions}
          validators={sessionValidators}
        />
      </Page>
    );
  }

  selectActions = () => {
    this.setState({ action: 'actions' });
  }

  selectOverview = () => {
    this.setState({ action: 'overview' });
  }
}

export default withMulti(
  App,
  translate,
  withObservable('stakingIntentions'),
  withObservable('sessionValidators'),
  withObservable('validatingBalances', { paramProp: 'stakingIntentions' })
);
