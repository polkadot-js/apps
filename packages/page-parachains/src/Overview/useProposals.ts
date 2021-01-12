// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Option } from '@polkadot/types';
import type { EventRecord, ParachainProposal, ParaId } from '@polkadot/types/interfaces';
import type { ProposalExt } from './types';

import { useEffect, useState } from 'react';

import { useApi, useCall, useIsMountedRef } from '@polkadot/react-hooks';

function createExt (approvedIds: ParaId[], entries: [{ args: [ParaId] }, Option<ParachainProposal>][]): ProposalExt[] {
  return entries
    .filter(([, opt]) => opt.isSome)
    .map(([{ args: [id] }, optProposal]) => ({
      id,
      isApproved: approvedIds.some((a) => a.eq(id)),
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
    approvedIds && trigger && api.query.proposeParachain.proposals
      .entries()
      .then((entries) =>
        mountedRef.current && setState(createExt(approvedIds, entries as any))
      )
      .catch(console.error);
  }, [api, approvedIds, mountedRef, trigger]);

  return state;
}
