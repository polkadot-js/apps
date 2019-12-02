/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedReferendumVote, DerivedReferendum } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ActionItem, Chart, Static, Voting } from '@polkadot/react-components';
import { formatBalance, formatNumber } from '@polkadot/util';
import VoteThreshold from '@polkadot/react-params/Param/VoteThreshold';
import { withCalls, withMulti } from '@polkadot/react-api';

import translate from '../translate';
import ProposalCell from './ProposalCell';

const COLORS_AYE = ['#64bebe', '#5badad'];
const COLORS_NAY = ['#d75ea1', '#e189ba'];

interface Props extends I18nProps {
  idNumber: BN;
  chain_bestNumber?: BN;
  democracy_referendumVotesFor?: DerivedReferendumVote[];
  democracy_enactmentPeriod: BN;
  value: DerivedReferendum;
}

interface State {
  voteCount: number;
  voteCountAye: number;
  voteCountNay: number;
  votedAye: BN;
  votedNay: BN;
  votedTotal: BN;
}

function Referendum ({ chain_bestNumber, className, democracy_enactmentPeriod, democracy_referendumVotesFor, t, value }: Props): React.ReactElement<Props> | null {
  const [{ voteCount, voteCountAye, voteCountNay, votedAye, votedNay, votedTotal }, setState] = useState<State>({
    voteCount: 0,
    voteCountAye: 0,
    voteCountNay: 0,
    votedAye: new BN(0),
    votedNay: new BN(0),
    votedTotal: new BN(0)
  });

  useEffect((): void => {
    if (democracy_referendumVotesFor) {
      const newState: State = democracy_referendumVotesFor.reduce((state, { balance, vote }): State => {
        if (vote.isAye) {
          state.voteCountAye++;
          state.votedAye = state.votedAye.add(balance);
        } else {
          state.voteCountNay++;
          state.votedNay = state.votedNay.add(balance);
        }

        state.voteCount++;
        state.votedTotal = state.votedTotal.add(balance);

        return state;
      }, {
        voteCount: 0,
        voteCountAye: 0,
        voteCountNay: 0,
        votedAye: new BN(0),
        votedNay: new BN(0),
        votedTotal: new BN(0)
      });

      if (newState.votedAye.eq(votedNay) && newState.votedNay.eq(votedNay)) {
        return;
      }

      setState(newState);
    }
  }, [democracy_referendumVotesFor]);

  if (!chain_bestNumber || value.info.end.sub(chain_bestNumber).lten(0)) {
    return null;
  }

  const enactBlock = (democracy_enactmentPeriod || new BN(0)).add(value.info.end);

  return (
    <tr className={className}>
      <td className='number'>{formatNumber(value.index)}</td>
      <ProposalCell className='top' proposal={value.proposal} />
      <td className='number top'>
        <label>{t('remaining')}</label>
        {formatNumber(value.info.end.sub(chain_bestNumber).subn(1))} blocks
      </td>
      <td className='number top'>
        <label>{t('activate at')}</label>
        {formatNumber(enactBlock)}
      </td>
      {/* <td>
        <VoteThreshold
          isDisabled
          defaultValue={{ isValid: true, value: value.info.threshold }}
          label={t('vote threshold')}
          name='voteThreshold'
          type={{
            info: 0,
            type: 'VoteThreshold'
          }}
        />
      </td> */}
      <td>
        {voteCount !== 0 && votedTotal.gtn(0) && (
          <div className='democracy--Referendum-results chart'>
            <Chart.HorizBar
              aspectRatio={4}
              values={[
                {
                  colors: COLORS_AYE,
                  label: `Aye, ${formatBalance(votedAye)} (${formatNumber(voteCountAye)})`,
                  value: votedAye.muln(10000).div(votedTotal).toNumber() / 100
                },
                {
                  colors: COLORS_NAY,
                  label: `Nay, ${formatBalance(votedNay)} (${formatNumber(voteCountNay)})`,
                  value: votedNay.muln(10000).div(votedTotal).toNumber() / 100
                }
              ]}
              showLabels={false}
            />
          </div>
        )}
      </td>
      <td className='number together top'>
        <Voting
          idNumber={value.index}
          proposal={value.proposal}
        />
      </td>
    </tr>
  );
}

export default withMulti(
  styled(Referendum)`
    .democracy--Referendum-results {
      margin-bottom: 1em;

      &.chart {
        text-align: center;
      }
    }
  `,
  translate,
  withCalls<Props>(
    'derive.chain.bestNumber',
    ['derive.democracy.referendumVotesFor', { paramName: 'idNumber' }],
    ['consts.democracy.enactmentPeriod', { fallbacks: ['query.democracy.publicDelay'] }]
  )
);
