// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ParaId } from '@polkadot/types/interfaces';
import type { ScheduledProposals } from './types';

import React, { useMemo } from 'react';

import { AddressMini, AddressSmall, Badge, Spinner, Toggle, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useSudo, useToggle } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import { useProposal } from './useProposals';
import { sliceHex } from './util';

interface Props {
  approvedIds: ParaId[];
  id: ParaId;
  scheduled: ScheduledProposals[];
}

function Proposal ({ approvedIds, id, scheduled }: Props): React.ReactElement<Props> {
  const { t } = useTranslation();
  const { api } = useApi();
  const { allAccounts } = useAccounts();
  const { hasSudoKey, sudoKey } = useSudo();
  const [isQueried, toggleIsQueried] = useToggle();
  const proposal = useProposal(id, approvedIds, scheduled, isQueried);

  const cancelTx = useMemo(
    () => api.tx.sudo && hasSudoKey
      ? api.tx.sudo.sudo(api.tx.proposeParachain.cancelProposal(id))
      : allAccounts.some((a) => proposal.proposal?.proposer.eq(a))
        ? api.tx.proposeParachain.cancelProposal(id)
        : null,
    [api, allAccounts, hasSudoKey, id, proposal]
  );

  const approveTx = useMemo(
    () => api.tx.sudo && api.tx.sudo.sudo(api.tx.proposeParachain.approveProposal(id)),
    [api, id]
  );

  const initialHex = useMemo(
    () => proposal?.proposal && sliceHex(proposal.proposal.genesisHead, 8),
    [proposal]
  );

  const validationHex = useMemo(
    () => proposal?.proposal && sliceHex(proposal.proposal.validationCode, 8),
    [proposal]
  );

  return (
    <tr>
      <td className='number'><h1>{formatNumber(id)}</h1></td>
      <td className='badge'>
        {(proposal.isApproved || proposal.isScheduled) && (
          <Badge
            color='green'
            icon={proposal.isScheduled ? 'clock' : 'check'}
          />
        )}
      </td>
      {isQueried && !proposal.proposal
        ? <td colSpan={6}><Spinner variant='mini' /></td>
        : (
          <>
            <td className='start together'>{proposal.proposal?.name.toUtf8()}</td>
            <td className='address'>{proposal.proposal && <AddressSmall value={proposal.proposal.proposer} />}</td>
            <td className='balance'>{proposal.proposal && <FormatBalance value={proposal.proposal.balance} />}</td>
            <td className='start hash together'>{initialHex}</td>
            <td className='start hash together'>{validationHex}</td>
            <td className='address all'>{proposal.proposal?.validators.map((validatorId) => (
              <AddressMini
                key={validatorId.toString()}
                value={validatorId}
              />
            ))}</td>
          </>
        )
      }
      <td className='button'>
        <Toggle
          label={t<string>('Details')}
          onChange={toggleIsQueried}
          value={isQueried}
        />
        {!proposal.isApproved && (
          <>
            <TxButton
              accountId={sudoKey}
              extrinsic={approveTx}
              icon='check'
              isDisabled={!hasSudoKey}
              label={t<string>('Approve')}
            />
            <TxButton
              accountId={hasSudoKey ? sudoKey : proposal.proposal?.proposer}
              extrinsic={cancelTx}
              icon='ban'
              isDisabled={!hasSudoKey || !proposal.proposal}
              label={t<string>('Cancel')}
            />
          </>
        )}
      </td>
    </tr>
  );
}

export default React.memo(Proposal);
