// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, BlockNumber, Votes } from '@polkadot/types/interfaces';
import { DeriveCollectiveProposal } from '@polkadot/api-derive/types';

import React, { useEffect, useState } from 'react';
import { ApiPromise } from '@polkadot/api';
import ProposalCell from '@polkadot/app-democracy/Overview/ProposalCell';
import { LinkExternal } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
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

interface Status {
  isCloseable: boolean;
  isVotable: boolean;
}

function getStatus (api: ApiPromise, bestNumber: BlockNumber, votes: Votes): Status {
  if (!votes.end) {
    return {
      isCloseable: false,
      isVotable: true
    };
  }

  const isEnd = bestNumber.gte(votes.end);

  if (api.tx.council.close.meta.args.length === 2) {
    return {
      isCloseable: isEnd,
      isVotable: !isEnd
    };
  }

  return {
    isCloseable: isEnd || votes.threshold.eq(votes.ayes.length),
    isVotable: !isEnd
  };
}

function Motion ({ className = '', isMember, members, motion: { hash, proposal, votes }, prime }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber, []);
  const [{ isCloseable, isVotable }, setStatus] = useState<Status>({ isCloseable: false, isVotable: false });

  useEffect((): void => {
    bestNumber && votes && setStatus(
      getStatus(api, bestNumber, votes)
    );
  }, [api, bestNumber, votes]);

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
      <Voters votes={ayes} />
      <Voters votes={nays} />
      <td className='button'>
        {isVotable && (
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
