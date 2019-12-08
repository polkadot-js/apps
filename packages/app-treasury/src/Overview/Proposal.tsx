// Copyright 2017-2019 @polkadot/app-democracy authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { TreasuryProposal } from '@polkadot/types/interfaces';
import { I18nProps } from '@polkadot/react-components/types';

import BN from 'bn.js';
import React, { useEffect } from 'react';
import { Option } from '@polkadot/types';
import { AddressMini, AddressSmall } from '@polkadot/react-components';
import { useApi, useCall } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import translate from '../translate';

interface Props extends I18nProps {
  isApproved?: boolean;
  proposalId: BN;
  onPopulate: () => void;
  onRespond: () => void;
}

function ProposalDisplay ({ className, onPopulate, proposalId, t }: Props): React.ReactElement<Props> | null {
  const { api } = useApi();
  const proposal = useCall<TreasuryProposal | null>(api.query.treasury.proposals, [proposalId], {
    transform: (value: Option<TreasuryProposal>): TreasuryProposal | null =>
      value.unwrapOr(null)
  });

  useEffect((): void => {
    proposal && onPopulate();
  }, [proposal]);

  if (!proposal) {
    return null;
  }

  return (
    <tr className={className}>
      <td className='number top'>
        <h1>{formatNumber(proposalId)}</h1>
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
    </tr>
  );
}

export default translate(ProposalDisplay);
