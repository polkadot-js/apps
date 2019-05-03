// Copyright 2017-2019 @polkadot/ui-reactive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, AccountIndex, Address, Balance, BlockNumber, Option, StakingLedger, UnlockChunk } from '@polkadot/types';
import { BareProps, CallProps } from '@polkadot/ui-api/types';
import { formatBalance } from '@polkadot/util';
import React from 'react';
import { withCalls } from '@polkadot/ui-api';

type Props = BareProps & CallProps & {
  balances_freeBalance?: Balance,
  chain_bestNumber?: BlockNumber,
  label?: string,
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null,
  remainingLabel?: string,
  staking_ledger?: StakingLedger,
  session_eraLength?: BlockNumber,
  unlockings?: Array<UnlockChunk>
};

export class UnlockingDisplay extends React.PureComponent<Props> {
  render () {
    const { className,chain_bestNumber, label = '', style, unlockings,remainingLabel = '', session_eraLength } = this.props;

    const remainingBlocks = (era: BlockNumber) => {
      if (!chain_bestNumber || !session_eraLength || era.lte(new BlockNumber(0))) {
        return new BlockNumber(0);
      } else {
        const remaining = session_eraLength.mul(era).sub(chain_bestNumber);
        return remaining.lte(new BlockNumber(0)) ? new BlockNumber(0) : remaining;
      }
    };

    const unlockingDivs = (unlockings: UnlockChunk[]) => (
      <>
        {unlockings.map((unlocking,index) => (
          <div
            className={className}
            style={style}
            key={index}
          >
            {label}{formatBalance(unlocking.value)} ({remainingBlocks(unlocking.era).toString()}{remainingLabel})
          </div>
        ))}
      </>
    );

    return unlockings ? unlockingDivs(unlockings) : null ;
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
