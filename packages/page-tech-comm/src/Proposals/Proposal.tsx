// Copyright 2017-2020 @polkadot/app-tech-comm authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Hash, Proposal as ProposalType, Votes } from '@polkadot/types/interfaces';

import React from 'react';
import { AddressMini } from '@polkadot/react-components';
import { useApi, useCall, useVotingStatus } from '@polkadot/react-hooks';
import { BlockToTime } from '@polkadot/react-query';
import ProposalCell from '@polkadot/app-democracy/Overview/ProposalCell';
import { Option } from '@polkadot/types';
import { formatNumber } from '@polkadot/util';

import Close from './Close';
import Voting from './Voting';

interface Props {
  className?: string;
  imageHash: Hash;
  isMember: boolean;
  members: string[];
  prime?: AccountId | null;
}

function Proposal ({ className = '', imageHash, isMember, members, prime }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const proposal = useCall<ProposalType | null>(api.query.technicalCommittee.proposalOf, [imageHash], {
    transform: (optProp: Option<ProposalType>) => optProp.unwrapOr(null)
  });
  const votes = useCall<Votes | null>(api.query.technicalCommittee.voting, [imageHash], {
    transform: (optVotes: Option<Votes>) => optVotes.unwrapOr(null)
  });
  const { hasFailed, isCloseable, isVoteable, remainingBlocks } = useVotingStatus(votes, members.length, 'technicalCommittee');

  if (!proposal || !votes) {
    return null;
  }

  const { ayes, end, index, nays, threshold } = votes;

  return (
    <tr className={className}>
      <td className='number'><h1>{formatNumber(index)}</h1></td>
      <ProposalCell
        imageHash={imageHash}
        proposal={proposal}
      />
      <td className='number'>
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
      <td className='address'>
        {ayes.map((address, index): React.ReactNode => (
          <AddressMini
            key={`${index}:${address.toHex()}`}
            value={address}
            withBalance={false}
          />
        ))}
      </td>
      <td className='address'>
        {nays.map((address, index): React.ReactNode => (
          <AddressMini
            key={`${index}:${address.toHex()}`}
            value={address}
            withBalance={false}
          />
        ))}
      </td>
      <td className='button'>
        {isVoteable && !isCloseable && (
          <Voting
            hash={imageHash}
            prime={prime}
            proposalId={index}
          />
        )}
        {isCloseable && (
          <Close
            hasFailed={hasFailed}
            hash={imageHash}
            idNumber={index}
            isDisabled={!isMember}
            members={members}
            proposal={proposal}
          />
        )}
      </td>
    </tr>
  );
}

export default React.memo(Proposal);
