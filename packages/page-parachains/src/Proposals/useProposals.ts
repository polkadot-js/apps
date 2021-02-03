// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { EventRecord, ParachainProposal, ParaId, SessionIndex } from '@polkadot/types/interfaces';
import type { ProposalExt, Proposals, ScheduledProposals } from '../types';

import { useEffect, useMemo, useState } from 'react';

import { useApi, useCall, useCallMulti, useIsMountedRef } from '@polkadot/react-hooks';

type MultiQuery = [EventRecord[], SessionIndex | undefined, ParaId[] | undefined];

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

const optionsMulti = {
  defaultValue: [[], undefined, undefined] as MultiQuery,
  transform: ([records, sessionIndex, approvedIds]: [EventRecord[], SessionIndex, ParaId[] | undefined]): MultiQuery => [
    records.filter(({ event, phase }) => phase?.isApplyExtrinsic && event?.section === 'proposeParachain'),
    sessionIndex,
    approvedIds
  ]
};

export default function useProposals (): Proposals | undefined {
  const { api } = useApi();
  const mountedRef = useIsMountedRef();
  const [state, setState] = useState<Proposals | undefined>();
  const [trigger, setTrigger] = useState(() => Date.now());
  const [events, sessionIndex, approvedIds] = useCallMulti<MultiQuery>([
    api.query.system.events,
    api.query.session.currentIndex,
    api.query.proposeParachain?.approvedProposals
  ], optionsMulti);

  // trigger on any proposeParachain events
  useEffect((): void => {
    mountedRef.current && events && setTrigger((trigger) =>
      events.length
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

export function useProposal (id: ParaId, approvedIds: ParaId[], scheduled: ScheduledProposals[]): ProposalExt {
  const { api } = useApi();
  // const opt = useCall<Option<ParachainProposal>>(api.query.proposeParachain_UNUSED?.proposals, [id]);
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
