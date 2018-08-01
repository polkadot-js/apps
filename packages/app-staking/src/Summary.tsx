// Copyright 2017-2018 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Header } from '@polkadot/primitives/Header';
import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-react-rx/types';

import BN from 'bn.js';
import React from 'react';
import storage from '@polkadot/storage';
import withApi from '@polkadot/ui-react-rx/with/api';
import isFunction from '@polkadot/util/is/function';
import encodeAddress from '@polkadot/util-keyring/address/encode';

import translate from './translate';

type Props = ApiProps & I18nProps & {};

type StorageIntentions = Array<Uint8Array>;
type StorageValidators = Array<Uint8Array>;

type StateBalances = {
  [index: string]: BN
};

type State = {
  balances: StateBalances,
  blockNumber: BN,
  intentions: Array<string>,
  intentionHigh: BN | null,
  sessionLast: BN,
  sessionLength: BN,
  subscriptions: Array<any>,
  validators: Array<string>,
  validatorLow: BN | null
};

type StateCb = (prevState: State) => State;

const ZERO = new BN(0);

class Summary extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);

    this.state = {
      balances: {},
      blockNumber: new BN(0),
      intentions: [],
      intentionHigh: null,
      sessionLength: new BN(60),
      sessionLast: new BN(0),
      subscriptions: [],
      validators: [],
      validatorLow: null
    };
  }

  componentDidMount () {
    this.setState({
      subscriptions: [
        this.subscribeBlocks(),
        this.subscribeIntentions(),
        this.subscribeValidators(),
        this.subscribeLength(),
        this.subscribeLast()
      ]
    });
  }

  private subscribeBlocks () {
    const { api } = this.props;

    return api.chain
      .newHead()
      .subscribe((header: Header) => {
        if (!header) {
          return;
        }

        this.setState({ blockNumber: header.number });
      });
  }

  private subscribeIntentions () {
    const { api } = this.props;

    return api.state
      .getStorage(storage.staking.public.intentions)
      .subscribe((storage: StorageIntentions) => {
        const intentions = storage.map(encodeAddress);

        this.nextState({ intentions } as State, () => {
          this.subscribeBalances(intentions);
        });
      });
  }

  private subscribeValidators () {
    const { api } = this.props;

    return api.state
      .getStorage(storage.session.public.validators)
      .subscribe((validators: StorageValidators) => {
        this.nextState({
          validators: validators.map(encodeAddress)
        } as State);
      });
  }

  private subscribeBalances (accounts: string[]) {
    const { api } = this.props;
    const { balances, subscriptions } = this.state;
    const newBalances = { ...balances };

    accounts.forEach((account) => {
      if (newBalances[account]) {
        return;
      } else {
        newBalances[account] = ZERO;
      }

      subscriptions.push(
        api.state
          // Here we pass a parameter to the key generator, so it points to the correct storage entry
          .getStorage(storage.staking.public.freeBalanceOf, account)
          .subscribe((balance: BN) => {
            this.nextState(({ balances }: State) => {
              const newBalances = { ...balances };

              newBalances[account] = balance;

              return {
                balances: newBalances
              } as State;
            });
          })
      );
    });

    this.nextState({
      balances: newBalances,
      subscriptions
    } as State);
  }

  private subscribeLength () {
    const { api } = this.props;

    return api.state
      .getStorage(storage.session.public.length)
      .subscribe((sessionLength: BN) => {
        this.setState({ sessionLength });
      });
  }

  private subscribeLast () {
    const { api } = this.props;

    return api.state
      .getStorage(storage.session.public.lastSessionChange)
      .subscribe((sessionLast: BN) => {
        this.setState({ sessionLast });
      });
  }

  componentWillUnmount () {
    const { subscriptions } = this.state;

    subscriptions.forEach((sub) => sub.unsubscribe());
  }

  private nextState (_nextState: State | StateCb, onDone?: () => void | Promise<void>) {
    this.setState((prevState: State) => {
      const nextState = isFunction(_nextState)
        ? _nextState(prevState)
        : _nextState;
      const { balances = prevState.balances, intentions = prevState.intentions, validators = prevState.validators } = nextState;
      const validatorLow = validators.reduce((low: BN | null, addr) => {
        const balance = balances[addr] || null;

        if (low === null || (balance && low.gt(balance))) {
          return balance;
        }

        return low;
      }, null);
      const intentionHigh = intentions.reduce((high: BN | null, addr) => {
        const balance = validators.includes(addr)
          ? null
          : balances[addr] || null;

        if (high === null || (balance && high.lt(balance))) {
          return balance;
        }

        return high;
      }, null);

      return {
        ...nextState,
        intentionHigh,
        validatorLow
      };
    }, onDone);
  }

  render () {
    const { t } = this.props;
    const { blockNumber, intentions, intentionHigh, sessionLast, sessionLength, validators, validatorLow } = this.state;

    return (
      <div>
        <div>{t('summary.headline', {
          defaultValue: '{{validatorCount}} validators, {{intentionCount}} accounts with intentions to stake',
          replace: {
            intentionCount: intentions.length,
            validatorCount: validators.length
          }
        })}</div>
        <div>{t('summary.balances', {
          defaultValue: 'lowest validator balance is {{validatorLow}}, highest balance intending to stake is {{intentionHigh}}',
          replace: {
            intentionHigh: intentionHigh ? intentionHigh.toString() : 'unknown',
            validatorLow: validatorLow ? validatorLow.toString() : 'unknown'
          }
        })}</div>
        <div>{t('summary.countdown', {
          defaultValue: 'session block {{remainder}} / {{length}} at #{{blockNumber}}',
          replace: {
            blockNumber: blockNumber.toString(),
            remainder: blockNumber.sub(sessionLast).mod(sessionLength).addn(1).toString(),
            length: sessionLength.toString()
          }
        })}</div>
      </div>
    );
  }
}

export default translate(
  withApi(Summary)
);
