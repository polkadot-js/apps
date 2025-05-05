// Copyright 2017-2025 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { ParachainProposal, ParaId } from '@polkadot/types/interfaces';
import type { ProposalExt, ScheduledProposals } from '../types.js';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCall } from '@polkadot/react-hooks';

function useProposalImpl (id: ParaId, approvedIds: ParaId[], scheduled: ScheduledProposals[]): ProposalExt {
  const { api } = useApi();
  const opt = useCall<Option<ParachainProposal>>(api.query.proposeParachain.proposals, [id]);

  return useMemo(
    (): ProposalExt => ({
      id,
      isApproved: approvedIds.some((a) => a.eq(id)),
      isScheduled: scheduled.some(({ scheduledIds }) => scheduledIds.some((s) => s.eq(id))),
      proposal: opt && opt.isSome
        ? opt.unwrap()
        : undefined
    }),
    [approvedIds, id, opt, scheduled]
  );
}

export default createNamedHook('useProposal', useProposalImpl);
