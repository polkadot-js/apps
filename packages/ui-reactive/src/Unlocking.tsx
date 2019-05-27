// Copyright 2017-2019 @polkadot/ui-reactive authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, AccountIndex, Address, BlockNumber, Option, StakingLedger, UnlockChunk } from '@polkadot/types';
import { BareProps, CallProps } from '@polkadot/ui-api/types';

import BN from 'bn.js';
import React from 'react';
import { formatBalance } from '@polkadot/util';
import { Icon, Tooltip, TxButton } from '@polkadot/ui-app';
import { withCalls } from '@polkadot/ui-api';

type Props = BareProps & CallProps & {
  chain_bestNumber?: BN,
  controllerId?: AccountId,
  label?: React.ReactNode,
  labelRedeem?: React.ReactNode,
  params?: AccountId | AccountIndex | Address | string | Uint8Array | null,
  remainingLabel?: string,
  staking_ledger?: StakingLedger,
  session_eraLength?: BN,
  unlockings?: Array<UnlockChunk>
};

type State = {
  tooltipOpen: boolean
};

export class UnlockingDisplay extends React.PureComponent<Props, State> {
  constructor (props: Props) {
    super(props);
    this.state = {
      tooltipOpen: false
    };
  }

  render () {
    const { className, label, unlockings } = this.props;

    return (
      <div className={className}>
        {
          unlockings
            ? (
              <>
                {this.renderUnlockableSum()}
                {this.renderLocked()}
              </>
            )
            : <>{label}0</>
        }
      </div>
    );
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
    const { controllerId, label, unlockings } = this.props;
    const { tooltipOpen } = this.state;

    if (!unlockings || !controllerId) return null;
    // select the Unlockchunks that can't be unlocked yet.
    const filteredUnlockings = unlockings.filter((chunk) => this.remainingBlocks(chunk.era).gtn(0));
    // group the Unlockchunks that have the same era and sum their values
    const groupedUnlockings = filteredUnlockings.length ? this.groupByEra(filteredUnlockings) : undefined;
    const result = groupedUnlockings && Object.keys(groupedUnlockings).map((eraString) => (
      <div key={eraString}>
        {label}
        {formatBalance(groupedUnlockings[eraString])}
        <Icon
          name='info circle'
          data-tip
          data-for={`controlled-trigger${eraString}`}
          onMouseOver={this.toggleTooltip}
          onMouseOut={this.toggleTooltip}
        />
        {tooltipOpen && (
          <Tooltip
            text={`${this.remainingBlocks(new BlockNumber(eraString))} blocks left`}
            trigger={`controlled-trigger${eraString}`}
          />
        )}
      </div>
    ));

    return result && result.length
      ? result
      : <>{label}0</>;
  }

  private renderUnlockableSum () {
    const { controllerId, labelRedeem, unlockings } = this.props;

    if (!unlockings || !unlockings[0] || !controllerId) {
      return null;
    }

    const unlockable = unlockings.filter((chunk) => this.remainingBlocks(chunk.era).eqn(0));
    const unlockableSum = unlockable.reduce((curr, prev) => {
      return curr.add(prev.value);
    }, new BN(0));

    return (
      unlockableSum.gtn(0)
        ? (
            <>
              {labelRedeem}
              {formatBalance(unlockableSum)}
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
          </>
        )
        : null
    );
  }

  private toggleTooltip = () => {
    this.setState(({ tooltipOpen }) => ({
      tooltipOpen: !tooltipOpen
    }));
  }
}

export default withCalls<Props>(
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
