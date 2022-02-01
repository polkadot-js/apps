// Copyright 2017-2022 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ParaId } from '@polkadot/types/interfaces';
import type { ScheduledProposals } from '../types';

import React, { useCallback, useMemo } from 'react';

import { AddressMini, AddressSmall, Badge, Expander, ParaLink, TxButton } from '@polkadot/react-components';
import { useAccounts, useApi, useSudo } from '@polkadot/react-hooks';
import { FormatBalance } from '@polkadot/react-query';
import { formatNumber } from '@polkadot/util';

import { useTranslation } from '../translate';
import { sliceHex } from '../util';
import useProposal from './useProposal';

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
  const proposal = useProposal(id, approvedIds, scheduled);

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
    () => proposal?.proposal && sliceHex(proposal.proposal.genesisHead),
    [proposal]
  );

  const renderVals = useCallback(
    () => proposal.proposal?.validators.map((validatorId) => (
      <AddressMini
        key={validatorId.toString()}
        value={validatorId}
      />
    )),
    [proposal.proposal]
  );

  return (
    <tr>
      <td className='number together'><h1>{formatNumber(id)}</h1></td>
      <td className='badge together'>
        {(proposal.isApproved || proposal.isScheduled) && (
          <Badge
            color='green'
            icon={proposal.isScheduled ? 'clock' : 'check'}
          />
        )}
      </td>
      <td className='badge'><ParaLink id={id} /></td>
      <td className='start together'>{proposal.proposal?.name.toUtf8()}</td>
      <td className='address'>
        {proposal.proposal?.validators && (
          <Expander
            renderChildren={renderVals}
            summary={t<string>('Validators ({{count}})', { replace: { count: formatNumber(proposal.proposal?.validators.length) } })}
          />
        )}
      </td>
      <td className='address'>{proposal.proposal && <AddressSmall value={proposal.proposal.proposer} />}</td>
      <td className='number media--1100'>{proposal.proposal && <FormatBalance value={proposal.proposal.balance} />}</td>
      <td className='start hash together all'>{initialHex}</td>
      <td className='button'>
        {!(proposal.isApproved || proposal.isScheduled) && (
          <>
            <TxButton
              accountId={sudoKey}
              className='media--800'
              extrinsic={approveTx}
              icon='check'
              isDisabled={!hasSudoKey}
              label={t<string>('Approve')}
            />
            <TxButton
              accountId={hasSudoKey ? sudoKey : proposal.proposal?.proposer}
              className='media--1100'
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
