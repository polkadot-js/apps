// Copyright 2017-2018 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the ISC license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { RawParam } from '@polkadot/ui-app/Params/types';
import { RxReferendum, RxReferendumVote } from '@polkadot/ui-react-rx/ApiObservable/types';

import BN from 'bn.js';
import React from 'react';
import Static from '@polkadot/ui-app/Static';
import Doughnut from '@polkadot/ui-app/Chart/Doughnut';
import VoteThreshold from '@polkadot/ui-app/Params/Param/VoteThreshold';
import classes from '@polkadot/ui-app/util/classes';
import numberFormat from '@polkadot/ui-react-rx/util/numberFormat';
import withObservable from '@polkadot/ui-react-rx/with/observable';
import withMulti from '@polkadot/ui-react-rx/with/multi';

import Item from './Item';
import translate from './translate';

type Props = I18nProps & {
  bestNumber?: BN,
  democracyReferendumVoters?: Array<RxReferendumVote>,
  idNumber: BN,
  value: RxReferendum
};

type State = {
  voteCount: number,
  votedNay: BN,
  votedYay: BN
};

class Referendum extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      voteCount: 0,
      votedYay: new BN(0),
      votedNay: new BN(0)
    };
  }

  static getDerivedStateFromProps ({ democracyReferendumVoters }: Props, prevState: State): State | null {
    if (!democracyReferendumVoters) {
      return null;
    }

    const votedYay = democracyReferendumVoters.reduce((yay, { balance, vote }) => {
      return vote
        ? yay.add(balance)
        : yay;
    }, new BN(0));
    const votedNay = democracyReferendumVoters.reduce((nay, { balance, vote }) => {
      return vote
        ? nay
        : nay.add(balance);
    }, new BN(0));

    console.error(JSON.stringify(democracyReferendumVoters), votedYay.toString(), votedNay.toString());

    if (votedYay.eq(prevState.votedNay) && votedNay.eq(prevState.votedNay)) {
      return null;
    }

    return {
      voteCount: democracyReferendumVoters.length,
      votedYay,
      votedNay
    };
  }

  render () {
    const { className, idNumber, style, value } = this.props;

    return (
      <Item
        className={classes('democracy--Referendum', className)}
        idNumber={idNumber}
        proposal={value.proposal}
        proposalExtra={this.renderExtra()}
        style={style}
      >
        {this.renderResults()}
        {this.renderVoting()}
      </Item>
    );
  }

  private renderExtra () {
    const { bestNumber, t, value: { blockNumber, voteThreshold } } = this.props;

    if (!bestNumber) {
      return null;
    }

    return (
      <div className='democracy--Referendum-info'>
        <Static label={t('referendum.endLabel', {
          defaultValue: 'remaining time'
        })}>
          {t('referendum.endInfo', {
            defaultValue: '{{remaining}} blocks remaining, ending at block #{{blockNumber}}',
            replace: {
              blockNumber: numberFormat(blockNumber),
              remaining: numberFormat(blockNumber.sub(bestNumber))
            }
          })}
        </Static>
        <VoteThreshold
          isDisabled
          defaultValue={{ value: voteThreshold } as RawParam}
          label={t('referendum.thresholdLabel', {
            defaultValue: 'vote threshold'
          })}
          name='voteThreshold'
        />
      </div>
    );
  }

  private renderResults () {
    const { t } = this.props;
    const { voteCount, votedYay, votedNay } = this.state;

    if (voteCount === 0) {
      return (
        <div className='democracy--Referendum-results'>
          {t('referendum.noVotes', {
            defaultValue: 'No votes found for this referendum'
          })}
        </div>
      );
    }

    return (
      <div className='democracy--Referendum-results chart'>
        <Doughnut values={[
          { colors: ['#4d4', '#4e4'], label: t('vote.yay', { defaultValue: 'yay' }), value: votedYay },
          { colors: ['#d44', '#e44'], label: t('vote.nay', { defaultValue: 'nay' }), value: votedNay }
        ]} />
      </div>
    );
  }

  private renderVoting () {
    return 'extra voting stuff goes here';
  }
}

export default withMulti(
  translate(Referendum),
  withObservable('bestNumber'),
  withObservable('democracyReferendumVoters', { paramProp: 'idNumber' })
);
