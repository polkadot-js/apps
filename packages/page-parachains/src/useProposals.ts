// Copyright 2017-2021 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { ParaId, SessionIndex } from '@polkadot/types/interfaces';
import type { Proposals } from './types';

import { useEffect, useState } from 'react';

import { useApi, useCallMulti, useEventTrigger, useIsMountedRef } from '@polkadot/react-hooks';

type MultiQuery = [SessionIndex | undefined, ParaId[] | undefined];

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
  defaultValue: [undefined, undefined] as MultiQuery
};

export default function useProposals (): Proposals | undefined {
  const { api } = useApi();
  const [state, setState] = useState<Proposals | undefined>();
  const mountedRef = useIsMountedRef();
  const trigger = useEventTrigger(['proposeParachain']);
  const [sessionIndex, approvedIds] = useCallMulti<MultiQuery>([
    api.query.session.currentIndex,
    api.query.proposeParachain?.approvedProposals
  ], optionsMulti);

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
