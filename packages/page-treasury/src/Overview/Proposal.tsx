// Copyright 2017-2020 @polkadot/app-treasury authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveTreasuryProposal } from '@polkadot/api-derive/types';

import React from 'react';
import { AddressMini, AddressSmall, LinkExternal } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import Submission from './Submission';
import Voting from './Voting';

interface Props {
  className?: string;
  isMember: boolean;
  proposal: DeriveTreasuryProposal;
  onRespond: () => void;
  withSend: boolean;
}

function ProposalDisplay ({ className, isMember, proposal: { council, id, proposal }, withSend }: Props): React.ReactElement<Props> | null {
  return (
    <tr className={className}>
      <td className='number'>
        <h1>{formatNumber(id)}</h1>
      </td>
      <td className='address all'>
        <AddressSmall value={proposal.proposer} />
      </td>
      <td className='address'>
        <AddressMini value={proposal.beneficiary} />
      </td>
      <td className='number'>
        <FormatBalance value={proposal.value} />
      </td>
      <td className='number'>
        <FormatBalance value={proposal.bond} />
      </td>
      <td className='button'>
        {withSend && (
          <>
            <Submission
              councilProposals={council}
              id={id}
              isDisabled={!isMember}
            />
            <Voting
              councilProposals={council}
              isDisabled={!isMember}
            />
          </>
        )}
      </td>
      <td className='mini'>
        <LinkExternal
          data={id}
          type='treasury'
          withShort
        />
      </td>
    </tr>
  );
}

export default React.memo(ProposalDisplay);
