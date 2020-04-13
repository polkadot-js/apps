// Copyright 2017-2020 @polkadot/app-tech-comm authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, Proposal as ProposalType, Votes } from '@polkadot/types/interfaces';

import React from 'react';
import { AddressMini } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import ProposalCell from '@polkadot/app-democracy/Overview/ProposalCell';
import { Option } from '@polkadot/types';
import { formatNumber } from '@polkadot/util';

import Voting from './Voting';

interface Props {
  className?: string;
  imageHash: string;
  prime?: AccountId | null;
}

function Proposal ({ className, imageHash, prime }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const optProposal = useCall<Option<ProposalType>>(api.query.technicalCommittee.proposalOf, [imageHash]);
  const votes = useCall<Option<Votes>>(api.query.technicalCommittee.voting, [imageHash]);

  if (!optProposal?.isSome || !votes?.isSome) {
    return null;
  }

  const proposal = optProposal.unwrap();
  const { ayes, index, nays, threshold } = votes.unwrap();

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
      <td className='address'>
        {ayes.map((address, index): React.ReactNode => (
          <AddressMini
            key={`${index}:${address}`}
            value={address}
            withBalance={false}
          />
        ))}
      </td>
      <td className='address'>
        {nays.map((address, index): React.ReactNode => (
          <AddressMini
            key={`${index}:${address}`}
            value={address}
            withBalance={false}
          />
        ))}
      </td>
      <td className='button'>
        <Voting
          hash={imageHash}
          prime={prime}
          proposalId={index}
        />
      </td>
    </tr>
  );
}

export default React.memo(Proposal);
