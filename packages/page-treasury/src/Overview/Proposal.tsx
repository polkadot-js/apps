// Copyright 2017-2020 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveTreasuryProposal } from '@polkadot/api-derive/types';

import React from 'react';
import { AddressMini, AddressSmall, LinkExternal } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
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
  const { t } = useTranslation();

  return (
    <tr className={className}>
      <td className='number top'>
        <h1>{formatNumber(id)}</h1>
      </td>
      <td className='address'>
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
          label={t('beneficiary')}
          value={proposal.beneficiary}
        />
      </td>
      <td className='top'>
        <FormatBalance
          label={<label>{t('value')}</label>}
          value={proposal.value}
        />
      </td>
      <td className='top number together'>
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
        <LinkExternal
          data={id}
          type='treasury'
        />
      </td>
    </tr>
  );
}

export default React.memo(ProposalDisplay);
