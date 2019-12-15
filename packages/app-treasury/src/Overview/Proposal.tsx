// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedTreasuryProposal } from '@polkadot/api-derive/types';
import { I18nProps, VotingType } from '@polkadot/react-components/types';

import React from 'react';
import { AddressMini, AddressSmall, TreasuryProposal, Voting } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import Approve from './Approve';
import translate from '../translate';

interface Props extends I18nProps {
  isApproved?: boolean;
  proposal: DerivedTreasuryProposal;
}

function ProposalDisplay ({ className, isApproved, proposal: { id, proposal, council }, t }: Props): React.ReactElement<Props> | null {
  if (!proposal) {
    return null;
  }

  let accessory = null;
  if (!isApproved) {
    accessory = council.length > 0 && !!council[0].votes
      ? (
        <Voting
          hash={council[0].hash}
          idNumber={council[0].votes.index}
          proposal={council[0].proposal}
          type={VotingType.Council}
        />
      )
      : (
        <Approve
          proposalId={id}
          proposalInfo={
            <>
              <h3>
                Proposal #{id.toString()}
              </h3>
              <details>
                <TreasuryProposal proposal={proposal} />
              </details>
              <br />
            </>
          }
        />
      );
  }

  return (
    <tr className={className}>
      <td className='number top'>
        <h1>{formatNumber(id)}</h1>
      </td>
      <td>
        <AddressSmall value={proposal.proposer} />
      </td>
      <td className='top'>
        <FormatBalance
          label={<label>{t('bond')}</label>}
          value={proposal.bond}
        />
      </td>
      <td className='top'>
        <AddressMini
          label={<label>{t('beneficiary')}</label>}
          value={proposal.beneficiary}
        />
      </td>
      <td className='top'>
        <FormatBalance
          label={<label>{t('value')}</label>}
          value={proposal.value}
        />
      </td>
      <td className='number top together'>
        {accessory}
      </td>
    </tr>
  );
}

export default translate(ProposalDisplay);
