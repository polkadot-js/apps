// Copyright 2017-2025 @polkadot/app-council authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { AccountId } from '@polkadot/types/interfaces';

import React, { useMemo } from 'react';

import ProposalCell from '@polkadot/app-democracy/Overview/ProposalCell';
import { Icon, LinkExternal, Table } from '@polkadot/react-components';
import { useAccounts, useCollectiveInstance, useVotingStatus } from '@polkadot/react-hooks';
import { BlockToTime } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import Close from './Close.js';
import Voters from './Voters.js';
import Voting from './Voting.js';

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
  hasVotedNay: boolean;
}

function Motion ({ className = '', isMember, members, motion: { hash, proposal, votes }, prime }: Props): React.ReactElement<Props> | null {
  const { allAccounts } = useAccounts();
  const { hasFailed, isCloseable, isVoteable, remainingBlocks } = useVotingStatus(votes, members.length, 'council');
  const modLocation = useCollectiveInstance('council');

  const { hasVoted, hasVotedAye } = useMemo(
    (): VoterState => {
      if (votes) {
        const hasVotedAye = allAccounts.some((a) => votes.ayes.some((accountId) => accountId.eq(a)));
        const hasVotedNay = allAccounts.some((a) => votes.nays.some((accountId) => accountId.eq(a)));

        return {
          hasVoted: hasVotedAye || hasVotedNay,
          hasVotedAye,
          hasVotedNay
        };
      }

      return { hasVoted: false, hasVotedAye: false, hasVotedNay: false };
    },
    [allAccounts, votes]
  );

  if (!votes || !modLocation) {
    return null;
  }

  const { ayes, end, index, nays, threshold } = votes;

  return (
    <tr className={className}>
      <Table.Column.Id value={index} />
      <ProposalCell
        imageHash={hash}
        isCollective
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
