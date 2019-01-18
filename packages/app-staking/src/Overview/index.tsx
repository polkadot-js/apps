// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedBalancesMap } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/ui-app/types';

import './index.css';

import React from 'react';
import { AccountId, Balance } from '@polkadot/types';

import CurrentList from './CurrentList';
import Summary from './Summary';

type Props = I18nProps & {
  balances: DerivedBalancesMap,
  balanceArray: (_address: AccountId | string) => Array<Balance> | undefined,
  intentions: Array<string>,
  validators: Array<string>
};

const ZERO = new Balance(0);

export default class Overview extends React.PureComponent<Props> {
  render () {
    const { balances, balanceArray, intentions, validators } = this.props;
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
          balanceArray={balanceArray}
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
