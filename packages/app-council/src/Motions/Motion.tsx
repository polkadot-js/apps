// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedCollectiveProposal } from '@polkadot/api-derive/types';

import React from 'react';
import { AddressMini, LinkExternal } from '@polkadot/react-components';
import ProposalCell from '@polkadot/app-democracy/Overview/ProposalCell';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import Voting from './Voting';

interface Props {
  className?: string;
  isMember: boolean;
  members: string[];
  motion: DerivedCollectiveProposal;
}

export default function Motion ({ className, isMember, members, motion: { hash, proposal, votes } }: Props): React.ReactElement<Props> | null {
  const { t } = useTranslation();

  if (!votes) {
    return null;
  }

  const { ayes, index, nays, threshold } = votes;

  return (
    <tr className={className}>
      <td className='number top'><h1>{formatNumber(index)}</h1></td>
      <ProposalCell
        className='top'
        proposalHash={hash}
        proposal={proposal}
      />
      <td className='number top'>
        <label>{t('threshold')}</label>
        {formatNumber(ayes.length)}/{formatNumber(threshold)}
      </td>
      <td className='top'>
        {ayes.map((address, index): React.ReactNode => (
          <AddressMini
            key={`${index}:${address}`}
            label={index === 0 ? t('Aye') : undefined}
            value={address}
            withBalance={false}
          />
        ))}
      </td>
      <td className='top'>
        {nays.map((address, index): React.ReactNode => (
          <AddressMini
            key={`${index}:${address}`}
            label={index === 0 ? t('Nay') : undefined}
            value={address}
            withBalance={false}
          />
        ))}
      </td>
      <td className='number top together'>
        <Voting
          hash={hash}
          idNumber={index}
          isDisabled={!isMember}
          members={members}
          proposal={proposal}
        />
        <LinkExternal
          data={index}
          type='council'
        />
      </td>
    </tr>
  );
}
