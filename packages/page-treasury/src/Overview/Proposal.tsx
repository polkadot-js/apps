// Copyright 2017-2025 @polkadot/app-treasury authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { DeriveTreasuryProposal } from '@polkadot/api-derive/types';

import React, { useMemo } from 'react';

import { AddressMini, AddressSmall, Columar, LinkExternal, Table } from '@polkadot/react-components';
import { useApi, useToggle } from '@polkadot/react-hooks';
import { isFunction } from '@polkadot/util';

import { useTranslation } from '../translate.js';
import Council from './Council.js';

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
  const [isExpanded, toggleIsExpanded] = useToggle(false);

  const hasCouncil = isFunction(api.tx.council?.propose);
  const hasProposals = useMemo(
    () => !!council
      .map(({ votes }) => votes ? votes.index.toNumber() : -1)
      .filter((index) => index !== -1)
      .length,
    [council]
  );

  return (
    <>
      <tr className={`${className} isExpanded isFirst ${isExpanded ? '' : 'isLast'}`}>
        <Table.Column.Id value={id} />
        <td className='address all'>
          <AddressSmall value={proposal.beneficiary} />
        </td>
        <Table.Column.Balance value={proposal.value} />
        <td className='address'>
          <AddressMini
            balance={proposal.bond}
            value={proposal.proposer}
            withBalance
          />
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
        <Table.Column.Expand
          isExpanded={isExpanded}
          toggle={toggleIsExpanded}
        />
      </tr>
      <tr className={`${className} ${isExpanded ? 'isExpanded isLast' : 'isCollapsed'} packedTop`}>
        <td />
        <td
          className='columar'
          colSpan={4}
        >
          <Columar is100>
            <Columar.Column>
              <LinkExternal
                data={id}
                type='treasury'
                withTitle
              />
            </Columar.Column>
          </Columar>
        </td>
        <td />
      </tr>
    </>
  );
}

export default React.memo(ProposalDisplay);
