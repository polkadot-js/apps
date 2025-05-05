// Copyright 2017-2025 @polkadot/app-parachains authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { StorageKey } from '@polkadot/types';
import type { ParaId, SessionIndex } from '@polkadot/types/interfaces';
import type { Proposals } from './types.js';

import { useMemo } from 'react';

import { createNamedHook, useApi, useCallMulti, useEventTrigger, useIsMountedRef, useMapEntries, useMapKeys } from '@polkadot/react-hooks';

type MultiQuery = [SessionIndex | undefined, ParaId[] | undefined];

interface Scheduled {
  scheduledIds: ParaId[];
  sessionIndex: SessionIndex;
}

const OPT_MULTI = {
  defaultValue: [undefined, undefined] as MultiQuery
};

const OPT_IDS = {
  transform: (keys: StorageKey<[ParaId]>[]): ParaId[] =>
    keys.map(({ args: [id] }) => id)
};

const OPT_SCHED = {
  transform: (entries: [StorageKey<[SessionIndex]>, ParaId[]][]): Scheduled[] =>
    entries.map(([{ args: [sessionIndex] }, scheduledIds]) => ({
      scheduledIds,
      sessionIndex
    }))
};

function useProposalsImpl (): Proposals | undefined {
  const { api } = useApi();
  const mountedRef = useIsMountedRef();
  const trigger = useEventTrigger([api.events.proposeParachain?.ProposeParachain]);
  const proposalIds = useMapKeys(api.query.proposeParachain?.proposals, [], OPT_IDS, trigger.blockHash);
  const scheduled = useMapEntries(api.query.proposeParachain?.scheduledProposals, [], OPT_SCHED, trigger.blockHash);
  const [sessionIndex, approvedIds] = useCallMulti<MultiQuery>([
    api.query.session.currentIndex,
    api.query.proposeParachain?.approvedProposals
  ], OPT_MULTI);

  return useMemo(
    () => approvedIds && sessionIndex && proposalIds && scheduled && mountedRef.current
      ? {
        approvedIds,
        proposalIds,
        scheduled: scheduled.filter((s) => s.sessionIndex.gt(sessionIndex))
      }
      : undefined,
    [approvedIds, mountedRef, proposalIds, sessionIndex, scheduled]
  );
}

export default createNamedHook('useProposals', useProposalsImpl);
