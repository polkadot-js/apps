// Copyright 2017-2019 @polkadot/ui-reactive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, CallProps } from '@polkadot/ui-api/types';

import { AccountId, AccountIndex, Address, Balance, BalanceLock } from '@polkadot/types';
import { formatBalance } from '@polkadot/util';
import React from 'react';
import { withCalls } from '@polkadot/ui-api';

type Props = BareProps & CallProps & {
  balances_freeBalance?: Balance,
  balances_locks?: Array<BalanceLock>,
  children?: React.ReactNode,
  label?: string,
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null
};

export class AvailableDisplay extends React.PureComponent<Props> {
  render () {
    const { balances_freeBalance, balances_locks, children, className, label = '', style } = this.props;
    const available = balances_freeBalance && balances_locks && balances_locks[0] && balances_locks[0].amount && balances_freeBalance.sub(balances_locks[0].amount);

//    console.log('params', params && params.toString());
//    console.log('balances_freeBalance',balances_freeBalance && balances_freeBalance.toString());
//    console.log('balancesLocksAmount',balances_locks && balances_locks.amount && balances_locks.amount.toString());
//    console.log('available', available && available.toString());
    return (
      <div
        className={className}
        style={style}
      >
        {label}{
          available
            ? formatBalance(available)
            : '0'
          }{children}
      </div>
    );
  }
}

export default withCalls<Props>(
  ['query.balances.freeBalance', { paramName: 'params' }],
  ['query.balances.locks', { paramName: 'params' }]
)(AvailableDisplay);
