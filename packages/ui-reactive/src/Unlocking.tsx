// Copyright 2017-2019 @polkadot/ui-reactive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, AccountIndex, Address, Option, StakingLedger, UnlockChunk } from '@polkadot/types';
import { BareProps, CallProps } from '@polkadot/ui-api/types';
import BN from 'bn.js';
import { formatBalance } from '@polkadot/util';
import React from 'react';
import { withCalls } from '@polkadot/ui-api';

type Props = BareProps & CallProps & {
  balances_freeBalance?: BN,
  chain_bestNumber?: BN,
  label?: { unlockable: string, locked: string, remaining: string },
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null,
  remainingLabel?: string,
  staking_ledger?: StakingLedger,
  session_eraLength?: BN,
  unlockings?: Array<UnlockChunk>
};

export class UnlockingDisplay extends React.PureComponent<Props> {

  remainingBlocks = (era: BN) => {
    const { chain_bestNumber, session_eraLength } = this.props;

    if (!chain_bestNumber || !session_eraLength || era.lten(0)) {
      return new BN(0);
    } else {
      const remaining = session_eraLength.mul(era).sub(chain_bestNumber);
      return remaining.lten(0) ? new BN(0) : remaining;
    }
  }

  render () {
    const { className,label = { unlockable: '', locked: '', remaining: '' }, style, unlockings } = this.props;
    if (!unlockings) return null;

    const unlockable = unlockings.filter((chunk) => this.remainingBlocks(chunk.era).eqn(0));
    const locked = unlockings.filter((chunk) => this.remainingBlocks(chunk.era).gtn(0));
    const unlockableSum = unlockable.reduce(
      (curr, prev) => {
        return new UnlockChunk({ value: curr.value.add(prev.value || new BN(0)) });
      }
     ).value;

    return unlockings ?
      <>
        <div
            className={className}
            style={style}
            key='unlockable'
          >
      {label.unlockable}{formatBalance(unlockableSum)}
      </div>
      <div>
        {locked.map((unlocking,index) => (
          <div
            className={className}
            style={style}
            key={index}
          >
            {label.locked}{formatBalance(unlocking.value)} ({this.remainingBlocks(unlocking.era).toString()}{label.remaining})
          </div>
        ))}
      </div>
      </>
    : null ;
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
    propName: 'unlockings',
    transform: (ledger: Option<StakingLedger>) =>
    ledger.unwrapOr({ unlocking: null }).unlocking
  }],
  'derive.session.eraLength',
  'derive.chain.bestNumber'
)(UnlockingDisplay);
