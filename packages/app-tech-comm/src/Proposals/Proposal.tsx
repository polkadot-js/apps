// Copyright 2017-2019 @polkadot/app-tech-comm authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Proposal as ProposalType, Votes } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { AddressMini } from '@polkadot/react-components';
import { useApi, useStream } from '@polkadot/react-hooks';
import ProposalCell from '@polkadot/app-democracy/Overview/ProposalCell';
import { Option } from '@polkadot/types';
import { formatNumber } from '@polkadot/util';

import translate from '../translate';
import Voting from './Voting';

interface Props extends I18nProps {
  hash: string;
}

function Proposal ({ className, hash, t }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const optProposal = useStream<Option<ProposalType>>(api.query.technicalCommittee.proposalOf, [hash]);
  const votes = useStream<Option<Votes>>(api.query.technicalCommittee.voting, [hash]);

  if (!optProposal?.isSome || !votes?.isSome) {
    return null;
  }

  const proposal = optProposal.unwrap();
  const { ayes, index, nays, threshold } = votes.unwrap();

  return (
    <tr className={className}>
      <td className='number top'><h1>{formatNumber(index)}</h1></td>
      <ProposalCell className='top' proposalHash={hash} proposal={proposal} />
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
            label={t('Nay')}
            value={address}
            withBalance={false}
          />
        ))}
      </td>
      <td className='number top together'>
        <Voting
          hash={hash}
          proposalId={index}
        />
      </td>
    </tr>
  );
}

export default translate(Proposal);
