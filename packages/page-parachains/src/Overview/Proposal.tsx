// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ParaId } from '@polkadot/types/interfaces';
import type { ScheduledProposals } from './types';

import React, { useMemo } from 'react';

import { AddressMini, AddressSmall, Badge, TxButton } from '@polkadot/react-components';
import { useApi, useSudo } from '@polkadot/react-hooks';
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
  const { hasSudoKey, sudoKey } = useSudo();
  const proposal = useProposal(id, approvedIds, scheduled);

  const approveTx = useMemo(
    () => api.tx.proposeParachain && api.tx.sudo && api.tx.sudo.sudo(api.tx.proposeParachain.approveProposal(id)),
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
        {proposal && (proposal.isApproved || proposal.isScheduled) && (
          <Badge
            color='green'
            icon={proposal.isScheduled ? 'clock' : 'check'}
          />
        )}
      </td>
      <td className='start together'>{proposal?.proposal?.name.toUtf8()}</td>
      <td className='address'>{proposal?.proposal && <AddressSmall value={proposal.proposal.proposer} />}</td>
      <td className='balance'>{proposal?.proposal && <FormatBalance value={proposal.proposal.balance} />}</td>
      <td className='start hash together'>{initialHex}</td>
      <td className='start hash together'>{validationHex}</td>
      <td className='address all'>{proposal?.proposal?.validators.map((validatorId) => (
        <AddressMini
          key={validatorId.toString()}
          value={validatorId}
        />
      ))}</td>
      <td className='button'>
        {proposal && !proposal.isApproved && (
          <TxButton
            accountId={sudoKey}
            extrinsic={approveTx}
            icon='check'
            isDisabled={!hasSudoKey}
            label={t<string>('Approve')}
          />
        )}
      </td>
    </tr>
  );
}

export default React.memo(Proposal);
