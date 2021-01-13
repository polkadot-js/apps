// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

// import type { Option } from '@polkadot/types';
// import type { Codec } from '@polkadot/types/types';

import type { EventRecord, ParaId, SessionIndex } from '@polkadot/types/interfaces';
import type { ProposalExt } from './types';

import { useEffect, useState } from 'react';

import { useApi, useCall, useIsMountedRef } from '@polkadot/react-hooks';

export interface ScheduledProposals {
  scheduledIds: ParaId[];
  sessionIndex: SessionIndex;
}

export interface Proposals {
  approvedIds: ParaId[];
  proposalIds: ParaId[];
  scheduled: ScheduledProposals[];
}

function createResult (approvedIds: ParaId[], proposalKeys: { args: [ParaId] }[], scheduledProposals: [{ args: [SessionIndex] }, ParaId[]][]): Proposals {
  return {
    approvedIds,
    proposalIds: proposalKeys.map(({ args: [id] }) => id),
    scheduled: scheduledProposals.map(([{ args: [sessionIndex] }, scheduledIds]) => ({
      scheduledIds,
      sessionIndex
    }))
  };
}

export default function useProposals (): Proposals | undefined {
  const { api } = useApi();
  const mountedRef = useIsMountedRef();
  const [state, setState] = useState<Proposals | undefined>();
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
          api.query.proposeParachain.proposals.keys(),
          api.query.proposeParachain.scheduledProposals.entries()
        ])
        .then(([proposals, scheduledProposals]) =>
          mountedRef.current &&
            setState(createResult(approvedIds, proposals as any, scheduledProposals as any))
        )
        .catch(console.error);
  }, [api, approvedIds, mountedRef, trigger]);

  return state;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useProposal (id: ParaId, approvedIds: ParaId[], scheduled: ScheduledProposals[]): ProposalExt | undefined {
  return undefined;
}

// export function useProposal (id: ParaId, approvedIds: ParaId[], scheduled: Scheduled[]): ProposalExt | undefined {
//   const { api } = useApi();
//   const proposal = useCall<Option<ParachainProposal>>(api.query.proposeParachain.proposals, [id]);

//   return useMemo(
//     (): ProposalExt | undefined => {
//       proposal && proposal?.isSome
//         ?
//     ),
//     [approvedIds, id, proposal, scheduled]
//   );
// }
