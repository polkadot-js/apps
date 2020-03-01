/* eslint-disable @typescript-eslint/camelcase */
// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedReferendumVote, DerivedReferendum } from '@polkadot/api-derive/types';
import { BlockNumber } from '@polkadot/types/interfaces';

import BN from 'bn.js';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Button, LinkExternal } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import PreImageButton from './PreImageButton';
import ProposalCell from './ProposalCell';
import Voting from './Voting';

interface Props {
  className?: string;
  idNumber: BN;
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

function Referendum ({ className, idNumber, value }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();
  const { api } = useApi();
  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber, []);
  const votesFor = useCall<DerivedReferendumVote[]>(api.derive.democracy.referendumVotesFor as any, [idNumber]);
  const [{ voteCountAye, voteCountNay, votedAye, votedNay }, setState] = useState<State>({
    voteCount: 0,
    voteCountAye: 0,
    voteCountNay: 0,
    votedAye: new BN(0),
    votedNay: new BN(0),
    votedTotal: new BN(0)
  });

  useEffect((): void => {
    if (votesFor) {
      const newState: State = votesFor.reduce((state, { balance, vote }): State => {
        const isDefault = vote.conviction.index === 0;
        const counted = balance
          .muln(isDefault ? 1 : vote.conviction.index)
          .divn(isDefault ? 10 : 1);

        if (vote.isAye) {
          state.voteCountAye++;
          state.votedAye = state.votedAye.add(counted);
        } else {
          state.voteCountNay++;
          state.votedNay = state.votedNay.add(counted);
        }

        state.voteCount++;
        state.votedTotal = state.votedTotal.add(counted);

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
  }, [votesFor]);

  if (!bestNumber || value.info.end.sub(bestNumber).lten(0)) {
    return null;
  }

  const enactBlock = value.info.end.add(value.info.delay);

  return (
    <tr className={className}>
      <td className='number top'><h1>{formatNumber(value.index)}</h1></td>
      <ProposalCell
        className='top'
        proposalHash={value.hash}
        proposal={value.proposal}
      />
      <td className='number together top'>
        <label>{t('remaining')}</label>
        {formatNumber(value.info.end.sub(bestNumber).subn(1))} blocks
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
        <Button.Group>
          <Voting
            proposal={value.proposal}
            referendumId={value.index}
          />
          <PreImageButton
            hash={value.hash}
            proposal={value.proposal}
          />
        </Button.Group>
        <LinkExternal
          data={value.index}
          type='referendum'
        />
      </td>
    </tr>
  );
}

export default styled(Referendum)`
  .democracy--Referendum-results {
    margin-bottom: 1em;

    &.chart {
      text-align: center;
    }
  }
`;
