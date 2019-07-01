// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { I18nProps } from '@polkadot/ui-app/types';
import { RawParam } from '@polkadot/ui-params/types';
import { Option, Proposal, Votes } from '@polkadot/types';

import BN from 'bn.js';
import React from 'react';
import styled from 'styled-components';
import { ActionItem, Chart, Voting } from '@polkadot/ui-app';
import VoteThreshold from '@polkadot/ui-params/Param/VoteThreshold';
import { withCalls, withMulti } from '@polkadot/ui-api';
import settings from '@polkadot/ui-settings';
import { formatNumber } from '@polkadot/util';

import translate from '../translate';

const COLORS_YAY = settings.uiTheme === 'substrate'
  ? ['#4d4', '#4e4']
  : ['#64bebe', '#5badad'];
const COLORS_NAY = settings.uiTheme === 'substrate'
  ? ['#d44', '#e44']
  : ['#d75ea1', '#e189ba'];

type Props = I18nProps & {
  idNumber: BN,
  chain_bestNumber?: BN,
  proposal: Proposal | null,
  votes: Votes | null
};

type State = {
  votedTotal: number,
  votedNay: number,
  votedYay: number
};

class Referendum extends React.PureComponent<Props, State> {
  state: State = {
    votedTotal: 0,
    votedYay: 0,
    votedNay: 0
  };

  static getDerivedStateFromProps ({ votes }: Props): State | null {
    if (!votes) {
      return null;
    }

    const { ayes, nays } = votes;

    const newState: State = {
      votedNay: nays.length,
      votedYay: ayes.length,
      votedTotal: ayes.length + nays.length
    };

    return newState;
  }

  render () {
    const { className, idNumber, proposal } = this.props;

    if (!proposal) {
      return null;
    }

    return (
      <ActionItem
        className={className}
        idNumber={idNumber}
        proposal={proposal}
        accessory={
          <Voting
            isCouncil
            idNumber={idNumber}
          />
        }
      >
        {this.renderInfo()}
      </ActionItem>
    );
  }

  private renderInfo () {
    const { votes, t } = this.props;

    if (!votes) {
      return null;
    }

    const { threshold } = votes;

    return (
      <div>
        {this.renderResults()}
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
    const { votedTotal, votedYay, votedNay } = this.state;

    if (votedTotal === 0) {
      return null;
    }

    return (
      <div className='democracy--Referendum-results chart'>
        <Chart.HorizBar
          values={[
            {
              colors: COLORS_YAY,
              label: `Yay, ${formatNumber(votedYay)} votes`,
              value: ((votedYay / votedTotal) * 100)
            },
            {
              colors: COLORS_NAY,
              label: `Yay, ${formatNumber(votedNay)} votes`,
              value: ((votedNay / votedTotal) * 100)
            }
          ]}
        />
      </div>
    );
  }
}

export default withMulti(
  styled(Referendum as React.ComponentClass<Props>)`
    .democracy--Referendum-results {
      margin-bottom: 1em;

      &.chart {
        text-align: center;
      }
    }
  `,
  translate,
  withCalls<Props>(
    [
      'query.councilMotions.proposalOf',
      {
        paramName: 'hash',
        propName: 'proposal',
        transform: (value: Option<Proposal>) => value.unwrapOr(null)
      }
    ],
    [
      'query.councilMotions.voting',
      {
        paramName: 'hash',
        propName: 'votes',
        transform: (value: Option<Votes>) => value.unwrapOr(null)
      }
    ]
  )
);
