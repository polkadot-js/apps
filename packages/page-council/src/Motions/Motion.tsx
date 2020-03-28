// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { AccountId, BlockNumber } from '@polkadot/types/interfaces';
import { DeriveCollectiveProposal } from '@polkadot/api-derive/types';

import BN from 'bn.js';
import React from 'react';
import ProposalCell from '@polkadot/app-democracy/Overview/ProposalCell';
import { AddressMini, LinkExternal } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { BlockToTime } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

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
  const bestNumber = useCall<BlockNumber>(api.derive.chain.bestNumber, []) || new BN(0);

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
      <td className='number'>
        {formatNumber(ayes.length)}/{formatNumber(threshold)}
      </td>
      <td className='number together'>
        {end && (
          <>
            <BlockToTime blocks={end.sub(bestNumber)} />
            #{formatNumber(end)}
          </>
        )}
      </td>
      <td className='number'>
        {ayes.map((address, index): React.ReactNode => (
          <AddressMini
            key={`${index}:${address}`}
            value={address}
            withBalance={false}
          />
        ))}
      </td>
      <td className='number'>
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
          hash={hash}
          idNumber={index}
          isDisabled={!isMember}
          members={members}
          prime={prime}
          proposal={proposal}
        />
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
