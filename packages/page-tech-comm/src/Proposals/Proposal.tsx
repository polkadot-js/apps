// Copyright 2017-2025 @polkadot/app-tech-comm authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveCollectiveProposal } from '@polkadot/api-derive/types';
import type { CollectiveType } from '@polkadot/react-hooks/types';
import type { Hash } from '@polkadot/types/interfaces';

import React from 'react';

import ProposalCell from '@polkadot/app-democracy/Overview/ProposalCell';
import { AddressMini, Table } from '@polkadot/react-components';
import { useApi, useCall, useCollectiveInstance, useVotingStatus } from '@polkadot/react-hooks';
import { BlockToTime } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import Close from './Close.js';
import Voting from './Voting.js';

interface Props {
  className?: string;
  imageHash: Hash;
  isMember: boolean;
  members: string[];
  prime?: string | null;
  type: CollectiveType;
}

function Proposal ({ className = '', imageHash, isMember, members, prime, type }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const derive = useCall<DeriveCollectiveProposal>(api.derive[type as 'technicalCommittee'].proposal, [imageHash]);
  const { hasFailed, isCloseable, isVoteable, remainingBlocks } = useVotingStatus(derive?.votes, members.length, type);
  const modLocation = useCollectiveInstance(type);

  if (!modLocation || !derive?.votes) {
    return null;
  }

  const { ayes, end, index, nays, threshold } = derive.votes;

  return (
    <tr className={className}>
      <Table.Column.Id value={index} />
      <ProposalCell
        imageHash={imageHash}
        isCollective
        proposal={derive.proposal}
      />
      <td className='number'>
        {formatNumber(ayes.length)}/{formatNumber(threshold)}
      </td>
      <td className='number together'>
        {remainingBlocks && end && (
          <>
            <BlockToTime value={remainingBlocks} />
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
            isMember={isMember}
            members={members}
            prime={prime}
            proposalId={index}
            type={type}
          />
        )}
        {isCloseable && (
          <Close
            hasFailed={hasFailed}
            hash={imageHash}
            idNumber={index}
            proposal={derive.proposal}
            type={type}
          />
        )}
      </td>
    </tr>
  );
}

export default React.memo(Proposal);
