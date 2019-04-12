// Copyright 2017-2019 @polkadot/app-staking authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Balance, HeaderExtended } from '@polkadot/types';
import { BareProps } from '@polkadot/ui-app/types';
import { ComponentProps } from '../types';

import './index.css';

import React from 'react';
import { withCalls, withMulti } from '@polkadot/ui-api/with';
import { formatNumber } from '@polkadot/util';

import CurrentList from './CurrentList';
import Summary from './Summary';

type Props = BareProps & ComponentProps & {
  chain_subscribeNewHead?: HeaderExtended
};

const ZERO = new Balance(0);

class Overview extends React.PureComponent<Props> {
  render () {
    const { balances, chain_subscribeNewHead, controllers, nominators, recentlyOffline, validators } = this.props;
    const nextSorted = this.sortByBalance(
      controllers.filter((address) =>
        !validators.includes(address)
      )
    );
    const validatorsSorted = this.sortByBalance(validators);

    let lastBlock: string = '—';
    let lastAuthor: string | undefined;

    if (chain_subscribeNewHead) {
      lastBlock = formatNumber(chain_subscribeNewHead.blockNumber);
      lastAuthor = (chain_subscribeNewHead.author || '').toString();
    }

    return (
      <div className='staking--Overview'>
        <Summary
          balances={balances}
          controllers={controllers}
          lastBlock={lastBlock}
          lastAuthor={lastAuthor}
          validators={validators}
        />
        <CurrentList
          balances={balances}
          current={validatorsSorted}
          lastBlock={lastBlock}
          lastAuthor={lastAuthor}
          next={nextSorted}
          nominators={nominators}
          recentlyOffline={recentlyOffline}
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

export default withMulti(
  Overview,
  withCalls<Props>(
    'derive.chain.subscribeNewHead'
  )
);
