// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { EventRecord, ParachainProposal, ParaId, SessionIndex } from '@polkadot/types/interfaces';
import type { ProposalExt, Proposals, ScheduledProposals } from '../types';

import { useEffect, useMemo, useState } from 'react';

import { useApi, useCall, useIsMountedRef } from '@polkadot/react-hooks';

function createResult (sessionIndex: SessionIndex, approvedIds: ParaId[], proposalKeys: { args: [ParaId] }[], scheduledProposals: [{ args: [SessionIndex] }, ParaId[]][]): Proposals {
  return {
    approvedIds,
    proposalIds: proposalKeys.map(({ args: [id] }) => id),
    scheduled: scheduledProposals
      .map(([{ args: [sessionIndex] }, scheduledIds]) => ({
        scheduledIds,
        sessionIndex
      }))
      .filter((s) => s.sessionIndex.gt(sessionIndex))
  };
}

export default function useProposals (): Proposals | undefined {
  const { api } = useApi();
  const mountedRef = useIsMountedRef();
  const [state, setState] = useState<Proposals | undefined>();
  const [trigger, setTrigger] = useState(Date.now());
  const sessionIndex = useCall<SessionIndex>(api.query.session.currentIndex);
  const approvedIds = useCall<ParaId[]>(api.query.proposeParachain?.approvedProposals);
  const events = useCall<EventRecord[]>(api.query.system.events);

  // trigger on any proposeParachain events
  useEffect((): void => {
    mountedRef.current && events && setTrigger((trigger) =>
      events.filter((r) => r && r.phase?.isApplyExtrinsic && r.event?.section === 'proposeParachain').length
        ? Date.now()
        : trigger
    );
  }, [events, mountedRef]);

  // re-get all our entries in the list
  useEffect((): void => {
    approvedIds && sessionIndex && trigger &&
      Promise
        .all([
          api.query.proposeParachain.proposals.keys(),
          api.query.proposeParachain.scheduledProposals.entries()
        ])
        .then(([proposals, scheduledProposals]) =>
          mountedRef.current &&
            setState(createResult(sessionIndex, approvedIds, proposals as any, scheduledProposals as any))
        )
        .catch(console.error);
  }, [api, approvedIds, mountedRef, sessionIndex, trigger]);

  return state;
}

export function useProposal (id: ParaId, approvedIds: ParaId[], scheduled: ScheduledProposals[], isQueried = false): ProposalExt {
  const { api } = useApi();
  // const opt = useCall<Option<ParachainProposal>>(api.query.proposeParachain_UNUSED?.proposals, [id]);
  const opt = useCall<Option<ParachainProposal>>(isQueried && api.query.proposeParachain.proposals, [id]);

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
