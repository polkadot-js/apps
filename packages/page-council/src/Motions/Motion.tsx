// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId } from '@polkadot/types/interfaces';
import { DeriveCollectiveProposal } from '@polkadot/api-derive/types';

import React, { useEffect, useState } from 'react';
import ProposalCell from '@polkadot/app-democracy/Overview/ProposalCell';
import { Icon, LinkExternal } from '@polkadot/react-components';
import { useAccounts, useVotingStatus } from '@polkadot/react-hooks';
import { BlockToTime } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import Close from './Close';
import Voters from './Votes';
import Voting from './Voting';

interface Props {
  className?: string;
  isMember: boolean;
  members: string[];
  motion: DeriveCollectiveProposal;
  prime: AccountId | null;
}

interface VoterState {
  hasVoted: boolean;
  hasVotedAye: boolean;
}

function Motion ({ className = '', isMember, members, motion: { hash, proposal, votes }, prime }: Props): React.ReactElement<Props> | null {
  const { allAccounts } = useAccounts();
  const { hasFailed, isCloseable, isVoteable, remainingBlocks } = useVotingStatus(votes, members.length, 'council');
  const [{ hasVoted, hasVotedAye }, setIsVoter] = useState<VoterState>({ hasVoted: false, hasVotedAye: false });

  useEffect((): void => {
    if (votes) {
      const hasVotedAye = allAccounts.some((address) => votes.ayes.some((accountId) => accountId.eq(address)));

      setIsVoter({
        hasVoted: hasVotedAye || allAccounts.some((address) => votes.nays.some((accountId) => accountId.eq(address))),
        hasVotedAye
      });
    }
  }, [allAccounts, votes]);

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
        {formatNumber(threshold)}
      </td>
      <td className='number together'>
        {remainingBlocks && end && (
          <>
            <BlockToTime blocks={remainingBlocks} />
            #{formatNumber(end)}
          </>
        )}
      </td>
      <Voters
        isAye
        members={members}
        threshold={threshold}
        votes={ayes}
      />
      <Voters
        members={members}
        threshold={threshold}
        votes={nays}
      />
      <td className='button'>
        {isVoteable && !isCloseable && (
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
            hasFailed={hasFailed}
            hash={hash}
            idNumber={index}
            isDisabled={!isMember}
            members={members}
            proposal={proposal}
          />
        )}
      </td>
      <td className='badge'>
        {isMember && (
          <Icon
            color={hasVoted ? (hasVotedAye ? 'green' : 'red') : 'gray'}
            icon='asterisk'
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
