// Copyright 2017-2025 @polkadot/app-reputation-voting authors & contributors
// SPDX-License-Identifier: Apache-2.0

import type { BN } from '@polkadot/util';
import type { Referendum } from './types.js';

import { useMemo } from 'react';

import { createNamedHook } from '@polkadot/react-hooks';
import { bnToBn } from '@polkadot/util';

import useReferenda from './useReferenda.js';

export interface ProcessedReferendum extends Referendum {
  status: 'Approved' | 'Rejected' | 'Cancelled' | 'TimedOut' | 'Killed';
  completedAt: number | null;
}

// Extract block number from completed referendum data
// Handles both tuple format (data[0]) and direct block number
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function extractBlockNumber (data: any): BN {
  // If data is a tuple/array, get the first element (block number)
  // Otherwise, data itself is the block number
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return bnToBn(data[0] ?? data);
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
          completedAt = extractBlockNumber(r.info.asApproved).toNumber();
        } else if (r.info.isRejected) {
          status = 'Rejected';
          completedAt = extractBlockNumber(r.info.asRejected).toNumber();
        } else if (r.info.isCancelled) {
          status = 'Cancelled';
          completedAt = extractBlockNumber(r.info.asCancelled).toNumber();
        } else if (r.info.isTimedOut) {
          status = 'TimedOut';
          completedAt = extractBlockNumber(r.info.asTimedOut).toNumber();
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
