// Copyright 2017-2022 @polkadot/app-council authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { AccountId } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';

import ProposalCell from '@polkadot/app-democracy/Overview/ProposalCell';
import { Icon, LinkExternal } from '@polkadot/react-components';
import { useAccounts, useCollectiveInstance, useVotingStatus } from '@polkadot/react-hooks';
import { BlockToTime } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import Close from './Close';
import Voters from './Voters';
import Voting from './Voting';

interface Props {
  className?: string;
  isMember: boolean;
  members: string[];
  motion: DeriveCollectiveProposal;
  prime?: AccountId | null;
}

interface VoterState {
  hasVoted: boolean;
  hasVotedAye: boolean;
}

function Motion ({ className = '', isMember, members, motion: { hash, proposal, votes }, prime }: Props): React.ReactElement<Props> | null {
  const { allAccounts } = useAccounts();
  const { hasFailed, isCloseable, isVoteable, remainingBlocks } = useVotingStatus(votes, members.length, 'council');
  const modLocation = useCollectiveInstance('council');

  const { hasVoted, hasVotedAye } = useMemo(
    (): VoterState => {
      if (votes) {
        const hasVotedAye = allAccounts.some((address) => votes.ayes.some((accountId) => accountId.eq(address)));

        return {
          hasVoted: hasVotedAye || allAccounts.some((address) => votes.nays.some((accountId) => accountId.eq(address))),
          hasVotedAye
        };
      }

      return { hasVoted: false, hasVotedAye: false };
    },
    [allAccounts, votes]
  );

  if (!votes || !modLocation) {
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
            <BlockToTime value={remainingBlocks} />
            #{formatNumber(end)}
          </>
        )}
      </td>
      <td className='expand'>
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
      </td>
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
      <td className='links'>
        <LinkExternal
          data={index}
          hash={hash.toString()}
          type='council'
        />
      </td>
    </tr>
  );
}

export default React.memo(Motion);
