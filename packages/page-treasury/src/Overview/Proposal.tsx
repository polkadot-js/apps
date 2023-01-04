// Copyright 2017-2023 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveTreasuryProposal } from '@polkadot/api-derive/types';

import React, { useMemo } from 'react';

import { AddressMini, AddressSmall, LinkExternal, Table } from '@polkadot/react-components';
import { useApi } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { isFunction } from '@polkadot/util';

import { useTranslation } from '../translate';
import Council from './Council';

interface Props {
  className?: string;
  isMember: boolean;
  members: string[];
  proposal: DeriveTreasuryProposal;
  withSend: boolean;
}

function ProposalDisplay ({ className = '', isMember, members, proposal: { council, id, proposal }, withSend }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();

  const hasCouncil = isFunction(api.tx.council?.propose);
  const hasProposals = useMemo(
    () => !!council
      .map(({ votes }) => votes ? votes.index.toNumber() : -1)
      .filter((index) => index !== -1)
      .length,
    [council]
  );

  return (
    <tr className={className}>
      <Table.Column.Id value={id} />
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
        {hasCouncil
          ? hasProposals
            ? <a href='#/council/motions'>{t('Voting')}</a>
            : withSend && (
              <Council
                id={id}
                isDisabled={!isMember}
                members={members}
              />
            )
          : null
        }
      </td>
      <td className='links'>
        <LinkExternal
          data={id}
          type='treasury'
        />
      </td>
    </tr>
  );
}

export default React.memo(ProposalDisplay);
