// Copyright 2017-2020 @polkadot/app-treasury authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.

import { DeriveTreasuryProposal } from '@polkadot/api-derive/types';

import React, { useMemo } from 'react';
import { AddressMini, AddressSmall, LinkExternal } from '@polkadot/react-components';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import Council from './Council';

interface Props {
  className?: string;
  isMember: boolean;
  members: string[];
  onRespond: () => void;
  proposal: DeriveTreasuryProposal;
  withSend: boolean;
}

function ProposalDisplay ({ className = '', isMember, members, proposal: { council, id, proposal }, withSend }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();

  const hasProposals = useMemo(
    () => !!council
      .map(({ votes }) => votes ? votes.index.toNumber() : -1)
      .filter((index) => index !== -1)
      .length,
    [council]
  );

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
      <td className={hasProposals ? 'middle' : 'button'}>
        {hasProposals
          ? <a href='#/council/motions'>{t('Voting')}</a>
          : withSend && (
            <Council
              id={id}
              isDisabled={!isMember}
              members={members}
            />
          )
        }
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
