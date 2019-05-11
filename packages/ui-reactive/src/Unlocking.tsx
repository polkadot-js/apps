// Copyright 2017-2019 @polkadot/ui-reactive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, AccountIndex, Address, BlockNumber, Option, StakingLedger, UnlockChunk } from '@polkadot/types';
import { BareProps, CallProps } from '@polkadot/ui-api/types';
import BN from 'bn.js';
import { formatBalance } from '@polkadot/util';
import { I18nProps } from '@polkadot/ui-app/types';
import React from 'react';
import translate from '@polkadot/ui-app/translate';
import { TxButton } from '@polkadot/ui-app';
import { withCalls } from '@polkadot/ui-api';

type Props = BareProps & CallProps & I18nProps & {
  balances_freeBalance?: BN,
  chain_bestNumber?: BN,
  controllerId?: AccountId,
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null,
  remainingLabel?: string,
  staking_ledger?: StakingLedger,
  session_eraLength?: BN,
  unlockings?: Array<UnlockChunk>
};

export class UnlockingDisplay extends React.PureComponent<Props> {

  render () {
    const { unlockings } = this.props;

    return unlockings ?
      <>
        {this.renderUnlockableSum()}
        {this.renderLocked()}
      </>
    : null ;
  }

  private groupByEra (list: UnlockChunk[]) {

    return list.reduce((map, { era, value }) => {
      const key = era.toString();

      if (!map[key]) {
        map[key] = value;
      } else {
        map[key] = map[key].add(value);
      }

      return map;
    }, {} as { [index: string]: BN });
  }

  private remainingBlocks (era: BN) {
    const { chain_bestNumber, session_eraLength } = this.props;

    if (!chain_bestNumber || !session_eraLength || era.lten(0)) {
      return new BN(0);
    } else {
      const remaining = session_eraLength.mul(era).sub(chain_bestNumber);

      return remaining.lten(0) ? new BN(0) : remaining;
    }
  }

  private renderLocked () {
    const { className, controllerId, style, t, unlockings } = this.props;

    if (!unlockings || !controllerId) return null;
    // select the Unlockchunks that can't be unlocked yet.
    const filteredUnlockings = unlockings.filter((chunk) => this.remainingBlocks(chunk.era).gtn(0));
    // group the Unlockchunks that have the same era and sum their values
    const groupedUnlockings = filteredUnlockings.length ? this.groupByEra(filteredUnlockings) : undefined;

    return (
      <>
        {groupedUnlockings && Object.keys(groupedUnlockings).map(eraString => (
          <div
            className={className}
            style={style}
            key={eraString}
          >
          {t('locked {{balance}} ({{remaining}} blocks left)', {
            replace: {
              balance: formatBalance(groupedUnlockings[eraString]),
              remaining: this.remainingBlocks(new BlockNumber(eraString))
            }
          })}
          </div>
        ))}
      </>
    );
  }

  private renderUnlockableSum () {
    const { className, controllerId, style, t, unlockings } = this.props;

    if (!unlockings || !unlockings[0] || !controllerId) return null;

    const unlockable = unlockings.filter((chunk) => this.remainingBlocks(chunk.era).eqn(0));
    const unlockableSum = unlockable.reduce(
      (curr, prev) => {
        return new UnlockChunk({ value: curr.value.add(prev.value) });
      }, new UnlockChunk({ value: new BN(0), era: new BN(0) })
    ).value;

    return (unlockableSum.gtn(0) ?
      <div
        className={className}
        style={style}
        key='unlockable'
      >
        {t('unlockable {{unlockableSum}}',{
          replace: {
            unlockableSum: formatBalance(unlockableSum)
          }
        })}
        <TxButton
          accountId={controllerId.toString()}
          className='withDrawUnbonded'
          icon='lock'
          size='small'
          isPrimary
          key='unlock'
          params={[]}
          tx='staking.withdrawUnbonded'
        />
      </div>
      : null
    );
  }
}

export default translate(
  withCalls<Props>(
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
  )(UnlockingDisplay)
);
