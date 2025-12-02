// Copyright 2017-2025 @polkadot/app-reputation-voting authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { Referendum } from './types.js';

import { useMemo } from 'react';

import { createNamedHook } from '@polkadot/react-hooks';

import useReferenda from './useReferenda.js';

export interface ProcessedReferendum extends Referendum {
  status: 'Approved' | 'Rejected' | 'Cancelled' | 'TimedOut' | 'Killed';
  completedAt: number | null;
}

function useProcessedReferendaImpl (): ProcessedReferendum[] | undefined {
  const referenda = useReferenda();

  return useMemo(() => {
    if (!referenda) {
      return undefined;
    }

    return referenda
      .filter((r) => !r.info.isOngoing)
      .map((r): ProcessedReferendum => {
        let status: ProcessedReferendum['status'] = 'Killed';
        let completedAt: number | null = null;

        if (r.info.isApproved) {
          status = 'Approved';
          completedAt = r.info.asApproved[0].toNumber();
        } else if (r.info.isRejected) {
          status = 'Rejected';
          completedAt = r.info.asRejected[0].toNumber();
        } else if (r.info.isCancelled) {
          status = 'Cancelled';
          completedAt = r.info.asCancelled[0].toNumber();
        } else if (r.info.isTimedOut) {
          status = 'TimedOut';
          completedAt = r.info.asTimedOut[0].toNumber();
        } else if (r.info.isKilled) {
          status = 'Killed';
          completedAt = r.info.asKilled.toNumber();
        }

        return {
          ...r,
          completedAt,
          status
        };
      })
      .sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));
  }, [referenda]);
}

export default createNamedHook('useProcessedReferenda', useProcessedReferendaImpl);
