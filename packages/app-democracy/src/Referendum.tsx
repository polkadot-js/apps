// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedReferendumVote } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/ui-app/types';
import { RawParam } from '@polkadot/ui-params/types';

import BN from 'bn.js';
import React from 'react';
import { ReferendumInfo } from '@polkadot/types';
import { Chart, Static } from '@polkadot/ui-app/index';
import VoteThreshold from '@polkadot/ui-params/Param/VoteThreshold';
import { withCalls } from '@polkadot/ui-api/index';
import { formatBalance, formatNumber } from '@polkadot/ui-util';
import settings from '@polkadot/ui-settings';

import Item from './Item';
import Voting from './Voting';
import translate from './translate';

const COLORS_YAY = settings.uiTheme === 'substrate'
  ? ['#4d4', '#4e4']
  : ['#64bebe', '#5badad'];
const COLORS_NAY = settings.uiTheme === 'substrate'
  ? ['#d44', '#e44']
  : ['#d75ea1', '#e189ba'];

type Props = I18nProps & {
  chain_bestNumber?: BN,
  democracy_referendumVotesFor?: Array<DerivedReferendumVote>,
  democracy_publicDelay?: BN,
  idNumber: BN | number,
  value: ReferendumInfo
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
  state: State = {
    voteCount: 0,
    voteCountYay: 0,
    voteCountNay: 0,
    votedTotal: new BN(0),
    votedYay: new BN(0),
    votedNay: new BN(0)
  };

  static getDerivedStateFromProps ({ democracy_referendumVotesFor }: Props, prevState: State): State | null {
    if (!democracy_referendumVotesFor) {
      return null;
    }

    const newState: State = democracy_referendumVotesFor.reduce((state, { balance, vote }) => {
      if (vote.ltn(0)) {
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
    const { chain_bestNumber, idNumber, value } = this.props;

    if (!chain_bestNumber || value.end.sub(chain_bestNumber).lten(0)) {
      return null;
    }

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
    const { chain_bestNumber, democracy_publicDelay, t, value: { end, threshold } } = this.props;

    if (!chain_bestNumber) {
      return null;
    }

    const enactBlock = (democracy_publicDelay || new BN(0)).add(end);

    return (
      <div className='democracy--Referendum-info'>
        <Static label={t('ending at')}>
          {t('block #{{blockNumber}}, {{remaining}} blocks remaining', {
            replace: {
              blockNumber: formatNumber(end),
              remaining: formatNumber(end.sub(chain_bestNumber).subn(1))
            }
          })}
        </Static>
        <Static label={t('activate at (if passed)')}>
          {t('block #{{blockNumber}}', {
            replace: {
              blockNumber: formatNumber(enactBlock)
            }
          })}
        </Static>
        <VoteThreshold
          isDisabled
          defaultValue={{ value: threshold } as RawParam}
          label={t('vote threshold')}
          name='voteThreshold'
          type={{
            info: 0,
            type: 'VoteThreshold'
          }}
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
        <Chart.Doughnut
          values={[
            {
              colors: COLORS_YAY,
              label: `${formatBalance(votedYay)} (${formatNumber(voteCountYay)})`,
              value: votedYay.muln(10000).div(votedTotal).toNumber() / 100
            },
            {
              colors: COLORS_NAY,
              label: `${formatBalance(votedNay)} (${formatNumber(voteCountNay)})`,
              value: votedNay.muln(10000).div(votedTotal).toNumber() / 100
            }
          ]}
        />
      </div>
    );
  }
}

export default translate(
  withCalls<Props>(
    'derive.chain.bestNumber',
    ['derive.democracy.referendumVotesFor', { paramName: 'idNumber' }],
    'query.democracy.publicDelay'
  )(Referendum)
);
