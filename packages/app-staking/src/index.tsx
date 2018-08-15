// Copyright 2017-2018 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { BareProps } from '@polkadot/ui-app/types';
import { RxBalanceMap } from '@polkadot/ui-react-rx/ApiObservable/types';

import React from 'react';
import Page from '@polkadot/ui-app/Page';
import classes from '@polkadot/ui-app/util/classes';
import withObservable from '@polkadot/ui-react-rx/with/observable';
import withMulti from '@polkadot/ui-react-rx/with/multi';

import './index.css';

import StakeList from './StakeList';
import Summary from './Summary';

type Props = BareProps & {
  validatingBalances?: RxBalanceMap,
  stakingIntentions?: Array<string>,
  sessionValidators?: Array<string>
};

class App extends React.PureComponent<Props> {
  render () {
    const { className, sessionValidators = [], stakingIntentions = [], style, validatingBalances = {} } = this.props;

    return (
      <Page
        className={classes('staking--App', className)}
        style={style}
      >
        <Summary
          balances={validatingBalances}
          intentions={stakingIntentions}
          validators={sessionValidators}
        />
        <StakeList
          balances={validatingBalances}
          intentions={stakingIntentions}
          validators={sessionValidators}
        />
      </Page>
    );
  }
}

export default withMulti(
  App,
  withObservable('stakingIntentions'),
  withObservable('sessionValidators'),
  withObservable('validatingBalances', { paramProp: 'stakingIntentions' })
);
