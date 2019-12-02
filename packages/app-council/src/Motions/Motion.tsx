// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { Proposal as ProposalType, Votes } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React from 'react';
import { Option } from '@polkadot/types';

import { AddressMini, Voting } from '@polkadot/react-components';
import { withCalls, withMulti } from '@polkadot/react-api';
import ProposalCell from '@polkadot/app-democracy/Overview/ProposalCell';
import { formatNumber } from '@polkadot/util';

import translate from '../translate';

interface Props extends I18nProps {
  chain_bestNumber?: BN;
  hash: string;
  proposal: ProposalType | null;
  votes: Votes | null;
}

function Motion ({ className, hash, proposal, t, votes }: Props): React.ReactElement<Props> | null {
  if (!proposal || !votes) {
    return null;
  }

  const { ayes, index, nays, threshold } = votes;

  return (
    <tr className={className}>
      <td className='number top'><h1>{formatNumber(index)}</h1></td>
      <ProposalCell className='top' proposal={proposal} />
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
          isCouncil
          idNumber={index}
          proposal={proposal}
        />
      </td>
    </tr>
  );
}

export default withMulti(
  Motion,
  translate,
  withCalls<Props>(
    ['query.council.proposalOf', {
      paramName: 'hash',
      propName: 'proposal',
      transform: (value: Option<ProposalType>): ProposalType | null =>
        value.unwrapOr(null)
    }],
    ['query.council.voting', {
      paramName: 'hash',
      propName: 'votes',
      transform: (value: Option<Votes>): Votes | null =>
        value.unwrapOr(null)
    }]
  )
);
