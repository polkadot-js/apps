// Copyright 2017-2019 @polkadot/ui-reactive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { BareProps, CallProps } from '@polkadot/ui-api/types';

import { AccountId, AccountIndex, Address, Balance, Option, StakingLedger, UnlockChunk, BlockNumber } from '@polkadot/types';
import { formatBalance } from '@polkadot/util';
import React from 'react';
import { withCalls } from '@polkadot/ui-api';
import Unlock from '@polkadot/app-toolbox/Unlock';
import Params from '@polkadot/app-contracts/Params';

type Props = BareProps & CallProps & {
  balances_freeBalance?: Balance,
  children?: React.ReactNode,
  label?: string,
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null,
  staking_ledger?: StakingLedger,
  unlocking?: Array<UnlockChunk>
};

export class UnlockingDisplay extends React.PureComponent<Props> {
  render () {
    const { balances_freeBalance, children, className, label = '', style, unlocking, params } = this.props;
    const totalUnlocking: Balance | undefined = unlocking && unlocking.reduce((a,b): UnlockChunk => {
      return ({ 'value': a.value.add(b.value), 'era': new BlockNumber(0) } as UnlockChunk);
    },{ 'value': new Balance(0) }).value ;
    console.log('params', params && params.toString());
    console.log('balances_freeBalance',balances_freeBalance && balances_freeBalance.toString());
    console.log('unlocking',unlocking && unlocking.toString());
    const available = balances_freeBalance && totalUnlocking && balances_freeBalance.sub(totalUnlocking);
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
  ['query.staking.bonded', {
    paramName: 'params',
    propName: 'controllerId',
    transform: (value) =>
      value.unwrapOr(null)
  }],
  ['query.staking.ledger', {
    paramName: 'controllerId',
    propName: 'unlocking',
    transform: (ledger: Option<StakingLedger>) =>
    ledger.unwrapOr({ unlocking: null }).unlocking
  }]
)(UnlockingDisplay);
