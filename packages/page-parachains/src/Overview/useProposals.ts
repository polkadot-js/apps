// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { EventRecord, ParachainProposal, ParaId } from '@polkadot/types/interfaces';
import type { Codec } from '@polkadot/types/types';
import type { ProposalExt } from './types';

import { useEffect, useState } from 'react';

import { useApi, useCall, useIsMountedRef } from '@polkadot/react-hooks';

function createExt (approvedIds: ParaId[], proposals: [{ args: [ParaId] }, Option<ParachainProposal>][], scheduledProposals: [Codec, ParaId[]][]): ProposalExt[] {
  return proposals
    .filter(([, opt]) => opt.isSome)
    .map(([{ args: [id] }, optProposal]) => ({
      id,
      isApproved: approvedIds.some((a) => a.eq(id)),
      isScheduled: scheduledProposals.some(([, ids]) => ids.some((s) => s.eq(id))),
      proposal: optProposal.unwrap()
    }));
}

export default function useProposals (): ProposalExt[] | undefined {
  const { api } = useApi();
  const mountedRef = useIsMountedRef();
  const [state, setState] = useState<ProposalExt[] | undefined>();
  const [trigger, setTrigger] = useState(Date.now());
  const approvedIds = useCall<ParaId[]>(api.query.proposeParachain?.approvedProposals);
  const events = useCall<EventRecord[]>(api.query.system.events);

  // trigger on any proposeParachain events
  useEffect((): void => {
    mountedRef.current && events && setTrigger((trigger) =>
      events.filter(({ event: { section }, phase }) => phase.isApplyExtrinsic && section === 'proposeParachain').length
        ? Date.now()
        : trigger
    );
  }, [events, mountedRef]);

  // re-get all our entries in the list
  useEffect((): void => {
    approvedIds && trigger &&
      Promise
        .all([
          api.query.proposeParachain.proposals.entries(),
          api.query.proposeParachain.scheduledProposals.entries()
        ])
        .then(([proposals, scheduledProposals]) =>
          mountedRef.current &&
            setState(createExt(approvedIds, proposals as any, scheduledProposals as any))
        )
        .catch(console.error);
  }, [api, approvedIds, mountedRef, trigger]);

  return state;
}
