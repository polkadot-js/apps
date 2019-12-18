// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DerivedTreasuryProposal } from '@polkadot/api-derive/types';
import { I18nProps } from '@polkadot/react-components/types';

import React from 'react';
import { AddressMini, AddressSmall } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import translate from '../translate';
import Voting from './Voting';

interface Props extends I18nProps {
  isMember: boolean;
  proposal: DerivedTreasuryProposal;
  onRespond: () => void;
}

function ProposalDisplay ({ className, isMember, proposal: { council, id, proposal }, t }: Props): React.ReactElement<Props> | null {
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
        <Voting
          isDisabled={!isMember}
          proposals={council}
        />
      </td>
    </tr>
  );
}

export default translate(ProposalDisplay);
