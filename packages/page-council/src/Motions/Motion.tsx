// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, BlockNumber } from '@polkadot/types/interfaces';
import { DeriveCollectiveProposal } from '@polkadot/api-derive/types';

import React from 'react';
import ProposalCell from '@polkadot/app-democracy/Overview/ProposalCell';
import { LinkExternal } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { BlockToTime } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import Close from './Close';
import Votes from './Votes';
import Voting from './Voting';

interface Props {
  className?: string;
  isMember: boolean;
  members: string[];
  motion: DeriveCollectiveProposal;
  prime: AccountId | null;
}

function Motion ({ className, isMember, members, motion: { hash, proposal, votes }, prime }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber, []);

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
        {bestNumber && end && (
          <>
            <BlockToTime blocks={end.sub(bestNumber)} />
            #{formatNumber(end)}
          </>
        )}
      </td>
      <Votes votes={ayes} />
      <Votes votes={nays} />
      <td className='button'>
        {bestNumber && (
          end.gt(bestNumber)
            ? (
              <Voting
                hash={hash}
                idNumber={index}
                isDisabled={!isMember}
                members={members}
                prime={prime}
                proposal={proposal}
              />
            )
            : (
              <Close
                hash={hash}
                idNumber={index}
                isDisabled={!isMember}
                members={members}
                proposal={proposal}
              />
            )
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
