// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { RawParam } from '@polkadot/ui-app/Params/types';
import { DerivedReferendumVote } from '@polkadot/ui-react-rx/derive/types';

import BN from 'bn.js';
import React from 'react';
import { ReferendumInfo } from '@polkadot/types';
import { Chart, Static } from '@polkadot/ui-app/index';
import VoteThreshold from '@polkadot/ui-app/Params/Param/VoteThreshold';
import { withCall, withMulti } from '@polkadot/ui-react-rx/with/index';
import { balanceFormat, numberFormat } from '@polkadot/ui-react-rx/util/index';
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
  derive_chain_bestNumber?: BN,
  derive_democracy_referendumVotesFor?: Array<DerivedReferendumVote>,
  idNumber: BN,
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

  static getDerivedStateFromProps ({ derive_democracy_referendumVotesFor }: Props, prevState: State): State | null {
    if (!derive_democracy_referendumVotesFor) {
      return null;
    }

    const newState: State = derive_democracy_referendumVotesFor.reduce((state, { balance, vote }) => {
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
    const { derive_chain_bestNumber, idNumber, value } = this.props;

    if (!derive_chain_bestNumber || value.end.sub(derive_chain_bestNumber).lten(0)) {
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
    const { derive_chain_bestNumber, t, value: { end, threshold } } = this.props;

    if (!derive_chain_bestNumber) {
      return null;
    }

    return (
      <div className='democracy--Referendum-info'>
        <Static
          label={t('referendum.endLabel', {
            defaultValue: 'remaining time'
          })}
        >
          {t('referendum.endInfo', {
            defaultValue: '{{remaining}} blocks remaining, ending at block #{{blockNumber}}',
            replace: {
              blockNumber: numberFormat(end),
              remaining: numberFormat(end.sub(derive_chain_bestNumber).subn(1))
            }
          })}
        </Static>
        <VoteThreshold
          isDisabled
          defaultValue={{ value: threshold } as RawParam}
          label={t('referendum.thresholdLabel', {
            defaultValue: 'vote threshold'
          })}
          name='voteThreshold'
          type={{ info: 0, type: 'VoteThreshold' }}
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
              label: `${balanceFormat(votedYay)} (${numberFormat(voteCountYay)})`,
              value: votedYay.muln(10000).div(votedTotal).toNumber() / 100
            },
            {
              colors: COLORS_NAY,
              label: `${balanceFormat(votedNay)} (${numberFormat(voteCountNay)})`,
              value: votedNay.muln(10000).div(votedTotal).toNumber() / 100
            }
          ]}
        />
      </div>
    );
  }
}

export default withMulti(
  Referendum,
  translate,
  withCall('derive.chain.bestNumber'),
  withCall('derive.democracy.referendumVotesFor', { paramProp: 'idNumber' })
);
