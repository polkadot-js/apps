// Copyright 2017-2019 @polkadot/ui-reactive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, CallProps } from '@polkadot/ui-api/types';

import { AccountId, AccountIndex, Address, Balance, BalanceLock, BlockNumber } from '@polkadot/types';
import { formatBalance } from '@polkadot/util';
import React from 'react';
import { withCalls } from '@polkadot/ui-api';

type Props = BareProps & CallProps & {
  balances_freeBalance?: Balance,
  balances_locks?: Array<BalanceLock>,
  chain_bestNumber?: BlockNumber,
  children?: React.ReactNode,
  label?: string,
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null
};

export class AvailableDisplay extends React.PureComponent<Props> {

  maxBN (items: Balance[]) {
    return items.reduce((acc: Balance, val: Balance) => {
      return (val.gt(acc) ? val : acc);
    }, new Balance(0));
  }

  render () {
    const { balances_freeBalance, balances_locks, chain_bestNumber, children, className, label = '', style } = this.props;
    let maxLock = new Balance(0);

    if (Array.isArray(balances_locks)) {
      // only get the locks that are valid until passed the current block
      const totals = balances_locks.filter((value, index) => chain_bestNumber && value.until.gt(chain_bestNumber));
      // get the maximum of the locks according to https://github.com/paritytech/substrate/blob/master/srml/balances/src/lib.rs#L699
      maxLock = this.maxBN(totals.map(function (o) { return o.amount; }));
    }

    const available = maxLock.eq(new BlockNumber('0xffffffffffffffffffffffffffffffff')) ? new Balance(0) : balances_freeBalance && balances_freeBalance.sub(maxLock) ;

    return (
      <div
        className={className}
        style={style}
      >
        {label}{
          available
            ? formatBalance(available)
            : formatBalance(balances_freeBalance)
          }{children}
      </div>
    );
  }
}

export default withCalls<Props>(
  ['query.balances.freeBalance', { paramName: 'params' }],
  ['query.balances.locks', { paramName: 'params' }],
  'derive.chain.bestNumber'
)(AvailableDisplay);
