/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedReferendumVote, DerivedReferendum } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { formatNumber } from '@polkadot/util';
import { withCalls, withMulti } from '@polkadot/react-api';
import { FormatBalance } from '@polkadot/react-query';

import translate from '../translate';
import ProposalCell from './ProposalCell';
import Voting from './Voting';

interface Props extends I18nProps {
  idNumber: BN;
  chain_bestNumber?: BN;
  democracy_referendumVotesFor?: DerivedReferendumVote[];
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

function Referendum ({ chain_bestNumber, className, democracy_referendumVotesFor, t, value }: Props): React.ReactElement<Props> | null {
  const [{ voteCountAye, voteCountNay, votedAye, votedNay }, setState] = useState<State>({
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

  const enactBlock = value.info.end.add(value.info.delay);

  return (
    <tr className={className}>
      <td className='number top'><h1>{formatNumber(value.index)}</h1></td>
      <ProposalCell className='top' proposalHash={value.hash} proposal={value.proposal} />
      <td className='number together top'>
        <label>{t('remaining')}</label>
        {formatNumber(value.info.end.sub(chain_bestNumber).subn(1))} blocks
      </td>
      <td className='number together top'>
        <label>{t('activate at')}</label>
        {formatNumber(enactBlock)}
      </td>
      <td className='number together top'>
        <label>{t('Aye ({{count}})', { replace: { count: formatNumber(voteCountAye) } })}</label>
        <FormatBalance value={votedAye} />
      </td>
      <td className='number together top'>
        <label>{t('Nay ({{count}})', { replace: { count: formatNumber(voteCountNay) } })}</label>
        <FormatBalance value={votedNay} />
      </td>
      <td className='number together top'>
        <Voting referendumId={value.index} />
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
    ['derive.democracy.referendumVotesFor', { paramName: 'idNumber' }]
  )
);
