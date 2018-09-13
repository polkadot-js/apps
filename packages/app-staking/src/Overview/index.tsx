// Copyright 2017-2018 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { RxBalanceMap } from '@polkadot/ui-react-rx/ApiObservable/types';
import { I18nProps } from '@polkadot/ui-app/types';

import './index.css';

import BN from 'bn.js';
import React from 'react';

import CurrentList from './CurrentList';
import Summary from './Summary';

type Props = I18nProps & {
  balances: RxBalanceMap,
  intentions: Array<string>,
  validators: Array<string>
};

const ZERO = new BN(0);

export default class Overview extends React.PureComponent<Props> {
  render () {
    const { balances, intentions, validators } = this.props;
    const intentionsSorted = this.sortByBalance(
      intentions.filter((address) =>
        !validators.includes(address)
      )
    );
    const validatorsSorted = this.sortByBalance(validators);

    return (
      <div className='staking--Overview'>
        <Summary
          balances={balances}
          intentions={intentions}
          validators={validators}
        />
        <CurrentList
          balances={balances}
          current={validatorsSorted}
          next={intentionsSorted}
        />
      </div>
    );
  }

  private sortByBalance (list: Array<string>): Array<string> {
    const { balances } = this.props;

    return list.sort((a, b) => {
      const balanceA = balances[a] || { stakingBalance: ZERO };
      const balanceB = balances[b] || { stakingBalance: ZERO };

      return balanceB.stakingBalance.cmp(balanceA.stakingBalance);
    });
  }
}
