// Copyright 2017-2018 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { Header } from '@polkadot/primitives/header';
import { I18nProps } from '@polkadot/ui-app/types';
import { ApiProps } from '@polkadot/ui-react-rx/types';
import { Balance, BalanceMap } from './observables/types';

import BN from 'bn.js';
import React from 'react';
import apimethods from '@polkadot/jsonrpc';
import storage from '@polkadot/storage';
import classes from '@polkadot/ui-app/util/classes';
import withApiCall from '@polkadot/ui-react-rx/with/apiCall';
import withMulti from '@polkadot/ui-react-rx/with/multi';
import withStorage from '@polkadot/ui-react-rx/with/storage';
import numberFormat from '@polkadot/ui-react-rx/util/numberFormat';

import validatingBalances from './observables/validatingBalances';
import translate from './translate';

type Props = ApiProps & I18nProps & {
  intentions: Array<string>,
  lastBlockHeader?: Header,
  lastLengthChange?: BN,
  sessionLength?: BN,
  validators: Array<string>
};

type State = {
  balances: BalanceMap,
  subBalances: any
};

const DEFAULT_BLOCKNUMBER = new BN(0);
const DEFAULT_SESSION_CHANGE = new BN(0);
const DEFAULT_SESSION_LENGTH = new BN(60);

class Summary extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);

    this.state = {
      balances: {},
      subBalances: null
    };
  }

  componentDidUpdate (prevProps: Props) {
    const { intentions } = this.props;

    if (intentions !== prevProps.intentions) {
      this.subscribeBalances(intentions);
    }
  }

  private unsubscribeBalances () {
    const { subBalances } = this.state;

    if (subBalances) {
      subBalances.unsubscribe();
    }
  }

  private subscribeBalances (accounts: string[] = []) {
    const { api } = this.props;

    this.unsubscribeBalances();

    // FIXME: We want these as a HOC on the class
    const subBalances = validatingBalances(api, accounts).subscribe((balances: BalanceMap) => {
      this.setState({ balances });
    });

    this.setState({
      subBalances
    } as State);
  }

  componentWillUnmount () {
    this.unsubscribeBalances();
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
            validatorLow: validatorLow && validatorLow.stakingBalance
              ? `${numberFormat(validatorLow.stakingBalance)} (+${numberFormat(validatorLow.nominatedBalance)})`
              : 'unknown'
          }
        })}</div>
        <div>{t('summary.balance.stake', {
          defaultValue: ' highest balance intending to stake is {{intentionHigh}}',
          replace: {
            intentionHigh: intentionHigh
              ? `${numberFormat(intentionHigh.stakingBalance)} (+${numberFormat(intentionHigh.nominatedBalance)})`
              : 'unknown'
          }
        })}</div>
        <div>{t('summary.countdown', {
          defaultValue: 'session block {{remainder}} / {{length}} at #{{blockNumber}}',
          replace: {
            blockNumber: numberFormat(blockNumber),
            remainder: Math.max(1, blockNumber.sub(lastLengthChange).mod(sessionLength).addn(1).toNumber()).toString(),
            length: sessionLength.toString()
          }
        })}</div>
      </div>
    );
  }

  private calcIntentionsHigh (): Balance | null {
    const { intentions, validators } = this.props;
    const { balances } = this.state;

    return intentions.reduce((high: Balance | null, addr) => {
      const balance = validators.includes(addr) || !balances[addr]
        ? null
        : balances[addr];

      if (high === null || (balance && high.stakingBalance.lt(balance.stakingBalance))) {
        return balance;
      }

      return high;
    }, null);
  }

  private calcValidatorLow (): Balance | null {
    const { validators } = this.props;
    const { balances } = this.state;

    return validators.reduce((low: Balance | null, addr) => {
      const balance = balances[addr] || null;

      if (low === null || (balance && low.stakingBalance.gt(balance.stakingBalance))) {
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
