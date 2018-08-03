// Copyright 2017-2018 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Header } from '@polkadot/primitives/header';
import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-react-rx/types';

import BN from 'bn.js';
import React from 'react';
import apimethods from '@polkadot/jsonrpc';
import storage from '@polkadot/storage';
import classes from '@polkadot/ui-app/util/classes';
import withApiCall from '@polkadot/ui-react-rx/with/apiCall';
import withMulti from '@polkadot/ui-react-rx/with/multi';
import withStorage from '@polkadot/ui-react-rx/with/storage';

import translate from './translate';

type Props = ApiProps & I18nProps & {
  intentions: Array<string>,
  lastBlockHeader?: Header,
  lastLengthChange?: BN,
  sessionLength?: BN,
  validators: Array<string>
};

type StateBalances = {
  [index: string]: BN
};

type State = {
  balances: StateBalances,
  subscriptions: Array<any>
};

const DEFAULT_BALANCE = new BN(0);
const DEFAULT_BLOCKNUMBER = new BN(0);
const DEFAULT_SESSION_CHANGE = new BN(0);
const DEFAULT_SESSION_LENGTH = new BN(60);

class Summary extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);

    this.state = {
      balances: {},
      subscriptions: []
    };
  }

  componentDidUpdate (prevProps: Props) {
    const { intentions } = this.props;

    if (intentions !== prevProps.intentions) {
      this.subscribeBalances(intentions);
    }
  }

  private subscribeBalances (accounts: string[]) {
    const { api } = this.props;
    const { balances, subscriptions } = this.state;
    const newBalances = { ...balances };

    accounts.forEach((account) => {
      if (newBalances[account]) {
        return;
      } else {
        newBalances[account] = DEFAULT_BALANCE;
      }

      subscriptions.push(
        api.state
          // Here we pass a parameter to the key generator, so it points to the correct storage entry
          .getStorage(storage.staking.public.freeBalanceOf, account)
          .subscribe((balance: BN) => {
            this.setState(({ balances }: State) => {
              const newBalances = { ...balances };

              newBalances[account] = balance;

              return {
                balances: newBalances
              } as State;
            });
          })
      );
    });

    this.setState({
      balances: newBalances,
      subscriptions
    } as State);
  }

  componentWillUnmount () {
    const { subscriptions } = this.state;

    subscriptions.forEach((sub) => sub.unsubscribe());
  }

  render () {
    const { className, intentions, lastBlockHeader, lastLengthChange = DEFAULT_SESSION_CHANGE, style, sessionLength = DEFAULT_SESSION_LENGTH, t, validators } = this.props;
    const blockNumber = lastBlockHeader
      ? lastBlockHeader.number
      : DEFAULT_BLOCKNUMBER;
    const intentionHigh = this.calcIntentionsHigh();
    const validatorLow = this.calcValidatorLow();

    return (
      <div
        className={classes('staking--Summary', className)}
        style={style}
      >
        <div>{t('summary.headline', {
          defaultValue: '{{validatorCount}} validators, {{intentionCount}} accounts with intentions',
          replace: {
            intentionCount: intentions.length,
            validatorCount: validators.length
          }
        })}</div>
        <div>{t('summary.balance.validator', {
          defaultValue: 'lowest validator balance is {{validatorLow}}',
          replace: {
            validatorLow: validatorLow ? validatorLow.toString() : 'unknown'
          }
        })}</div>
        <div>{t('summary.balance.stake', {
          defaultValue: ' highest balance intending to stake is {{intentionHigh}}',
          replace: {
            intentionHigh: intentionHigh ? intentionHigh.toString() : 'unknown'
          }
        })}</div>
        <div>{t('summary.countdown', {
          defaultValue: 'session block {{remainder}} / {{length}} at #{{blockNumber}}',
          replace: {
            blockNumber: blockNumber.toString(),
            remainder: Math.max(1, blockNumber.sub(lastLengthChange).mod(sessionLength).addn(1).toNumber()).toString(),
            length: sessionLength.toString()
          }
        })}</div>
      </div>
    );
  }

  private calcIntentionsHigh (): BN | null {
    const { intentions, validators } = this.props;
    const { balances } = this.state;

    return intentions.reduce((high: BN | null, addr) => {
      const balance = validators.includes(addr)
        ? null
        : balances[addr] || null;

      if (high === null || (balance && high.lt(balance))) {
        return balance;
      }

      return high;
    }, null);
  }

  private calcValidatorLow (): BN | null {
    const { validators } = this.props;
    const { balances } = this.state;

    return validators.reduce((low: BN | null, addr) => {
      const balance = balances[addr] || null;

      if (low === null || (balance && low.gt(balance))) {
        return balance;
      }

      return low;
    }, null);
  }
}

export default withMulti(
  Summary,
  translate,
  withApiCall(
    apimethods.chain.public.newHead,
    { propName: 'lastBlockHeader' }
  ),
  withStorage(
    storage.session.public.length,
    { propName: 'sessionLength' }
  ),
  withStorage(
    storage.session.public.lastLengthChange,
    { propName: 'lastLengthChange' }
  )
);
