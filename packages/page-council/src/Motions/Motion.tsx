// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types/interfaces';
import { DeriveCollectiveProposal } from '@polkadot/api-derive/types';

import React from 'react';
import ProposalCell from '@polkadot/app-democracy/Overview/ProposalCell';
import { LinkExternal } from '@polkadot/react-components';
import { BlockToTime } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import Close from './Close';
import Voters from './Votes';
import Voting from './Voting';
import useVotingStatus from './useVotingStatus';

interface Props {
  className?: string;
  isMember: boolean;
  members: string[];
  motion: DeriveCollectiveProposal;
  prime: AccountId | null;
}

function Motion ({ className = '', isMember, members, motion: { hash, proposal, votes }, prime }: Props): React.ReactElement<Props> | null {
  const { isCloseable, isVoteable, remainingBlocks } = useVotingStatus(votes, members.length);

  if (!votes) {
    return null;
  }

  const { ayes, end, index, nays, threshold } = votes;

  return (
    <tr className={className}>
      <td className='number'><h1>{formatNumber(index)}</h1></td>
      <ProposalCell
        imageHash={hash}
        proposal={proposal}
      />
      <td className='number together'>
        {formatNumber(ayes.length)}/{formatNumber(threshold)}
      </td>
      <td className='number together'>
        {remainingBlocks && end && (
          <>
            <BlockToTime blocks={remainingBlocks} />
            #{formatNumber(end)}
          </>
        )}
      </td>
      <Voters votes={ayes} />
      <Voters votes={nays} />
      <td className='button'>
        {isVoteable && (
          <Voting
            hash={hash}
            idNumber={index}
            isDisabled={!isMember}
            members={members}
            prime={prime}
            proposal={proposal}
          />
        )}
        {isCloseable && (
          <Close
            hash={hash}
            idNumber={index}
            isDisabled={!isMember}
            members={members}
            proposal={proposal}
          />
        )}
      </td>
      <td className='mini'>
        <LinkExternal
          data={index}
          hash={hash.toString()}
          type='council'
          withShort
        />
      </td>
    </tr>
  );
}

export default React.memo(Motion);
