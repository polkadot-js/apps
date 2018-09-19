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
import numberFormat from '@polkadot/ui-react-rx/util/numberFormat';
import withObservable from '@polkadot/ui-react-rx/with/observable';
import withMulti from '@polkadot/ui-react-rx/with/multi';

import Item from './Item';
import Voting from './Voting';
import translate from './translate';

const COLORS_YAY = process.env.UI_THEME === 'substrate'
  ? ['#4d4', '#4e4']
  : ['#64bebe', '#5badad'];
const COLORS_NAY = process.env.UI_THEME === 'substrate'
  ? ['#d44', '#e44']
  : ['#d75ea1', '#e189ba'];

type Props = I18nProps & {
  bestNumber?: BN,
  democracyReferendumVoters?: Array<RxReferendumVote>,
  idNumber: BN,
  value: RxReferendum
};

type State = {
  voteCount: number,
  voteCountYay: number,
  voteCountNay: number,
  votedTotal: BN,
  votedNay: BN,
  votedYay: BN
};

class Referendum extends React.PureComponent<Props, State> {
  state: State;

  constructor (props: Props) {
    super(props);

    this.state = {
      voteCount: 0,
      voteCountYay: 0,
      voteCountNay: 0,
      votedTotal: new BN(0),
      votedYay: new BN(0),
      votedNay: new BN(0)
    };
  }

  static getDerivedStateFromProps ({ democracyReferendumVoters }: Props, prevState: State): State | null {
    if (!democracyReferendumVoters) {
      return null;
    }

    const newState: State = democracyReferendumVoters.reduce((state, { balance, vote }) => {
      if (vote) {
        state.voteCountYay++;
        state.votedYay = state.votedYay.add(balance);
      } else {
        state.voteCountNay++;
        state.votedNay = state.votedNay.add(balance);
      }

      state.voteCount++;
      state.votedTotal = state.votedTotal.add(balance);

      return state;
    }, {
      voteCount: 0,
      voteCountYay: 0,
      voteCountNay: 0,
      votedTotal: new BN(0),
      votedYay: new BN(0),
      votedNay: new BN(0)
    });

    if (newState.votedYay.eq(prevState.votedNay) && newState.votedNay.eq(prevState.votedNay)) {
      return null;
    }

    return newState;
  }

  render () {
    const { idNumber, value } = this.props;

    return (
      <Item
        idNumber={idNumber}
        proposal={value.proposal}
        proposalExtra={this.renderExtra()}
      >
        <Voting referendumId={idNumber} />
        {this.renderResults()}
      </Item>
    );
  }

  private renderExtra () {
    const { bestNumber, t, value: { blockNumber, voteThreshold } } = this.props;

    if (!bestNumber) {
      return null;
    }

    console.error('Referendum:: best:', numberFormat(bestNumber), 'target:', numberFormat(blockNumber), 'remaining:', numberFormat(blockNumber.sub(bestNumber)));

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
    const { voteCount, voteCountYay, voteCountNay, votedTotal, votedYay, votedNay } = this.state;

    if (voteCount === 0 || votedTotal.eqn(0)) {
      return null;
    }

    return (
      <div className='democracy--Referendum-results chart'>
        <Doughnut values={[
          {
            colors: COLORS_YAY,
            label: `${numberFormat(votedYay)} (${numberFormat(voteCountYay)})`,
            value: votedYay.muln(10000).div(votedTotal).toNumber() / 100
          },
          {
            colors: COLORS_NAY,
            label: `${numberFormat(votedNay)} (${numberFormat(voteCountNay)})`,
            value: votedNay.muln(10000).div(votedTotal).toNumber() / 100
          }
        ]} />
      </div>
    );
  }
}

export default withMulti(
  translate(Referendum),
  withObservable('bestNumber'),
  withObservable('democracyReferendumVoters', { paramProp: 'idNumber' })
);
